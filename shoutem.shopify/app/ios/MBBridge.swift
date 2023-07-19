//
//  MBBridge.swift
//
//  Created by Xavier Moreno Martínez on 08/05/2018.
//  Copyright © 2018 Facebook. All rights reserved.
//

import Foundation
import MobileBuySDK

@objc(MBBridge)
class MBBridge: NSObject {
  fileprivate var client: Graph.Client?
  fileprivate var checkoutId: GraphQL.ID?
  fileprivate var shippingAddress: Storefront.MailingAddressInput?
  fileprivate var paymentSettings: Storefront.PaymentSettings?
  fileprivate var webUrl: URL?

  @objc func initStore(_ shopDomain: NSString, apiKey: NSString, callback: @escaping (NSArray) -> Void) {
    client = Graph.Client(shopDomain: shopDomain as String, apiKey: apiKey as String)
    callback([true])
  }

  @objc func getShop(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let clientQuery = Storefront.buildQuery { $0
      .shop { $0
        .name()
        .moneyFormat()
        .paymentSettings { $0
          .cardVaultUrl()
        }
      }
    }
    client?.queryGraphWith(clientQuery) { response, error in
      if let shop = response?.fields["shop"] {
        resolve(shop)
        self.paymentSettings = response?.shop.paymentSettings
      } else {
        let error = error
        switch error {
        case let .http(statusCode)?:
          print("Shopify query failed: HTTP error code: \(statusCode)")
        case .none:
          print("Shopify query failed: none")
        case .some(.request(_)):
          print("Shopify query failed: request errors")
        case .some(.noData):
          print("Shopify query failed: noData")
        case .some(.jsonDeserializationFailed(_)):
          print("Shopify query failed: jsonDeserializationFailed")
        case .some(.invalidJson(_)):
          print("Shopify query failed: invalidJson")
        case .some(.invalidQuery(_)):
          print("Shopify query failed: invalidQuery")
        case .some(.schemaViolation(_)):
          print("Shopify query failed: schemaViolation")
        }
        print(error as Any)
      }

      if let error = error {
        reject("error", "Error loading shop", error)
      }

    }.resume()
  }

  @objc func getCollections(_ cursor: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let cursorValue = cursor == "" ? nil : cursor as String
    client?.queryGraphWith(MBBridge.queryForCollections(250, cursor: cursorValue)) { query, error in
      if let collections = query?.fields["collections"] {
        resolve(collections)
      }
      if let error = error {
        reject("error", "Error getting collections", error)
      }
    }.resume()
  }

  @objc func filterProducts(_ query: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    client?.queryGraphWith(MBBridge.queryForProducts(250, query: query as String)) { query, error in
      if let products = query?.fields["products"] {
        resolve(query?.fields)
      }
      if let error = error {
        reject("error", "Error filtering products", error)
      }
    }.resume()
  }

  @objc func createCustomer(_ query: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let email = query["email"] as? String ?? ""
    let password = query["password"] as? String ?? ""
    let firstName = query["firstName"] as? String ?? ""
    let lastName = query["lastName"] as? String ?? ""

    let input = Storefront.CustomerCreateInput.create(
      email: email,
      password: password,
      firstName: Input.value(firstName),
      lastName: Input.value(lastName)
    )

    let mutation = Storefront.buildMutation { $0
      .customerCreate(input: input) { $0
        .customer { $0
          .id()
          .email()
          .firstName()
          .lastName()
        }
        .customerUserErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error creating customer", error)
      }
    }.resume()
  }

  @objc func login(_ query: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let email = query["email"] as? String ?? ""
    let password = query["password"] as? String ?? ""

    let input = Storefront.CustomerAccessTokenCreateInput.create(
      email: email,
      password: password
    )

    let mutation = Storefront.buildMutation { $0
      .customerAccessTokenCreate(input: input) { $0
        .customerAccessToken { $0
          .accessToken()
          .expiresAt()
        }
        .customerUserErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        if let accessToken = response?.customerAccessTokenCreate?.customerAccessToken?.accessToken {
          MBBridge.saveAccessToken(accessToken)
        }

        resolve(fields)
      }
      if let error = error {
        reject("error", "Error creating customer", error)
      }
    }.resume()
  }

  @objc func getAccessToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to get logged in user", nil)
    }

    let accessToken = String(decoding: token, as: UTF8.self)
    return resolve(accessToken)
  }

  @objc func refreshToken(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }

    let accessToken = String(decoding: token, as: UTF8.self)

    let mutation = Storefront.buildMutation { $0
      .customerAccessTokenRenew(customerAccessToken: accessToken as String) { $0
        .customerAccessToken { $0
          .accessToken()
          .expiresAt()
        }
        .userErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error creating customer", error)
      }
    }.resume()
  }

  @objc func isLoggedIn(_ resolve: @escaping RCTPromiseResolveBlock, rejecter _: @escaping RCTPromiseRejectBlock) {
    if MBBridge.getAccessToken() != nil {
      resolve(true)
    } else {
      resolve(false)
    }
  }

  @objc func logout(_ resolve: @escaping RCTPromiseResolveBlock, rejecter _: @escaping RCTPromiseRejectBlock) {
    MBBridge.deleteAccessToken()
    resolve(true)
  }

  @objc func getCustomer(_ addressCursor: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to get customer data", nil)
    }
    let accessToken = String(decoding: token, as: UTF8.self)
    let cursorValue = addressCursor == "" ? nil : addressCursor as String

    let query = Storefront.buildQuery { $0
      .customer(customerAccessToken: accessToken as String) { $0
        .id()
        .firstName()
        .lastName()
        .phone()
        .email()
        .defaultAddress { $0
          .id()
          .address1()
          .address2()
          .city()
          .country()
          .countryCodeV2()
          .zip()
          .provinceCode()
          .province()
          .firstName()
          .lastName()
          .formattedArea()
          .latitude()
          .longitude()
          .phone()
        }
        .addresses(first: 25, after: cursorValue) { $0
          .edges { $0
            .cursor()
            .node { $0
              .id()
              .address1()
              .address2()
              .city()
              .country()
              .countryCodeV2()
              .zip()
              .provinceCode()
              .province()
              .firstName()
              .lastName()
              .formattedArea()
              .latitude()
              .longitude()
              .phone()
            }
          }
          .pageInfo { $0
            .hasNextPage()
          }
        }
      }
    }

    client?.queryGraphWith(query) { query, error in
      if let fields = query?.fields {
        resolve(fields)
      }
      if let error = error {
        print(error)
        reject("error", "Error getting customer", error)
      }
    }.resume()
  }

  @objc func updateCustomer(_ userInfo: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to get customer", nil)
    }
    let accessToken = String(decoding: token, as: UTF8.self)

    let input = Storefront.CustomerUpdateInput.create()

    if let firstName = userInfo["firstName"] as? String {
      input.firstName = Input.value(firstName)
    }

    if let lastName = userInfo["lastName"] as? String {
      input.lastName = Input.value(lastName)
    }

    if let email = userInfo["email"] as? String {
      input.lastName = Input.value(email)
    }

    if let phone = userInfo["phone"] as? String {
      input.phone = Input.value(phone)
    }

    let mutation = Storefront.buildMutation { $0
      .customerUpdate(customerAccessToken: accessToken as String, customer: input) { $0
        .customer { $0
          .id()
          .firstName()
          .lastName()
          .email()
          .phone()
        }
        .customerUserErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error updating customer", error)
      }
    }.resume()
  }

  @objc func createCustomerAddress(_ addressInfo: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }
    let accessToken = String(decoding: token, as: UTF8.self)

    let address1 = addressInfo["address1"] as? String ?? ""
    let address2 = addressInfo["address2"] as? String ?? ""
    let city = addressInfo["city"] as? String ?? ""
    let country = addressInfo["country"] as? String ?? ""
    let company = addressInfo["company"] as? String ?? ""
    let province = addressInfo["province"] as? String ?? ""
    let zip = addressInfo["zip"] as? String ?? ""
    let firstName = addressInfo["firstName"] as? String ?? ""
    let lastName = addressInfo["lastName"] as? String ?? ""
    let phone = addressInfo["phone"] as? String ?? ""

    let input = Storefront.MailingAddressInput.create(
      address1: Input.value(address1),
      address2: Input.value(address2),
      city: Input.value(city),
      company: Input.value(company),
      country: Input.value(country),
      firstName: Input.value(firstName),
      lastName: Input.value(lastName),
      phone: Input.value(phone),
      province: Input.value(province),
      zip: Input.value(zip)
    )

    let mutation = Storefront.buildMutation { $0
      .customerAddressCreate(customerAccessToken: accessToken as String, address: input) { $0
        .customerAddress { $0
          .id()
          .address1()
          .address2()
          .city()
          .country()
          .countryCodeV2()
          .company()
          .zip()
          .provinceCode()
          .province()
          .firstName()
          .lastName()
          .formattedArea()
          .latitude()
          .longitude()
          .phone()
        }
        .customerUserErrors { $0
          .field()
          .message()
        }
      }
    }
    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error updating customer's address", error)
      }
    }.resume()
  }

  @objc func updateCustomerDefaultAddress(_ addressId: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }

    let accessToken = String(decoding: token, as: UTF8.self)

    let mutation = Storefront.buildMutation { $0
      .customerDefaultAddressUpdate(customerAccessToken: accessToken as String, addressId: GraphQL.ID(rawValue: addressId as String)) { $0
        .customer { $0
          .id()
        }
        .customerUserErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error updating customer's default address", error)
      }
    }.resume()
  }

  @objc func updateCustomerAddress(_ addressId: NSString, addressInfo: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }

    let accessToken = String(decoding: token, as: UTF8.self)

    // TODO: Don't resolve values that aren't sent
    // because value will be overwritten to ""
    let address1 = addressInfo["address1"] as? String ?? ""
    let address2 = addressInfo["address2"] as? String ?? ""
    let city = addressInfo["city"] as? String ?? ""
    let country = addressInfo["country"] as? String ?? ""
    let company = addressInfo["company"] as? String ?? ""
    let province = addressInfo["province"] as? String ?? ""
    let zip = addressInfo["zip"] as? String ?? ""
    let firstName = addressInfo["firstName"] as? String ?? ""
    let lastName = addressInfo["lastName"] as? String ?? ""
    let phone = addressInfo["phone"] as? String ?? ""

    let input = Storefront.MailingAddressInput.create(
      address1: Input.value(address1),
      address2: Input.value(address2),
      city: Input.value(city),
      company: Input.value(company),
      country: Input.value(country),
      firstName: Input.value(firstName),
      lastName: Input.value(lastName),
      phone: Input.value(phone),
      province: Input.value(province),
      zip: Input.value(zip)
    )

    let mutation = Storefront.buildMutation { $0
      .customerAddressUpdate(customerAccessToken: accessToken as String, id: GraphQL.ID(rawValue: addressId as String), address: input) { $0
        .customerAddress { $0
          .id()
          .address1()
          .address2()
          .city()
          .country()
          .company()
          .countryCodeV2()
          .zip()
          .provinceCode()
          .province()
          .firstName()
          .lastName()
          .formattedArea()
          .latitude()
          .longitude()
          .phone()
        }
        .customerUserErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error updating customer's address", error)
      }
    }.resume()
  }

  @objc func deleteCustomerAddress(_ addressId: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }

    let accessToken = String(decoding: token, as: UTF8.self)

    let mutation = Storefront.buildMutation { $0
      .customerAddressDelete(id: GraphQL.ID(rawValue: addressId as String), customerAccessToken: accessToken as String) { $0
        .deletedCustomerAddressId()
        .customerUserErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error deleting customer's address", error)
      }
    }.resume()
  }

  @objc func getOrderByName(_ orderName: NSString, lineItemsCursor: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let cursorValue = lineItemsCursor == "" ? nil : lineItemsCursor as String
    let nameQuery = "name:\"\(orderName)\""

    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }

    let accessToken = String(decoding: token, as: UTF8.self)

    let query = Storefront.buildQuery { $0
      .customer(customerAccessToken: accessToken as String) { $0
        .orders(first: 1, query: nameQuery) { $0
          .edges { $0
            .cursor()
            .node { $0
              .id()
              .name()
              .orderNumber()
              .processedAt()
              .fulfillmentStatus()
              .financialStatus()
              .totalPriceV2 { $0
                .amount()
                .currencyCode()
              }
              .currentSubtotalPrice { $0
                .amount()
                .currencyCode()
              }
              .totalShippingPriceV2 { $0
                .amount()
                .currencyCode()
              }
              .shippingAddress { $0
                .city()
                .country()
                .countryCodeV2()
                .address1()
                .address2()
                .latitude()
                .longitude()
              }
              .lineItems(first: 25, after: cursorValue) { $0
                .edges { $0
                  .cursor()
                  .node { $0
                    .title()
                    .currentQuantity()
                    .originalTotalPrice { $0
                      .amount()
                      .currencyCode()
                    }
                    .discountedTotalPrice { $0
                      .amount()
                      .currencyCode()
                    }
                    .variant { $0
                      .title()
                      .id()
                      .image { $0
                        .url()
                      }
                    }
                  }
                }.pageInfo { $0
                  .hasNextPage()
                }
              }
            }
          }
        }
      }
    }

    client?.queryGraphWith(query) { query, error in
      if let fields = query?.fields {
        resolve(fields)
      }
      if let error = error {
        print(error)
        reject("error", "Error getting order by id", error)
      }
    }.resume()
  }

  @objc func getOrderHistory(_ pageSize: NSNumber, cursor: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let cursorValue = cursor == "" ? nil : cursor as String

    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }
    let accessToken = String(decoding: token, as: UTF8.self)

    let query = Storefront.buildQuery { $0
      .customer(customerAccessToken: accessToken as String) { $0
        .orders(first: Int32(pageSize), after: cursorValue) { $0
          .edges { $0
            .cursor()
            .node { $0
              .id()
              .name()
              .orderNumber()
              .processedAt()
              .fulfillmentStatus()
              .financialStatus()
              .totalPriceV2 { $0
                .amount()
                .currencyCode()
              }
              .currentSubtotalPrice { $0
                .amount()
                .currencyCode()
              }
              .totalShippingPriceV2 { $0
                .amount()
                .currencyCode()
              }
              .shippingAddress { $0
                .city()
                .country()
                .countryCodeV2()
                .address1()
                .address2()
                .latitude()
                .longitude()
              }
              .lineItems(first: 25) { $0
                .edges { $0
                  .cursor()
                  .node { $0
                    .title()
                    .currentQuantity()
                    .originalTotalPrice { $0
                      .amount()
                      .currencyCode()
                    }
                    .discountedTotalPrice { $0
                      .amount()
                      .currencyCode()
                    }
                    .variant { $0
                      .title()
                      .id()
                      .image { $0
                        .url()
                      }
                    }
                  }
                }.pageInfo { $0
                  .hasNextPage()
                }
              }
            }
          }
          .pageInfo { $0
            .hasNextPage()
          }
        }
      }
    }

    client?.queryGraphWith(query) { query, error in
      if let fields = query?.fields {
        resolve(fields)
      }
      if let error = error {
        print(error)
        reject("error", "Error getting order history", error)
      }
    }.resume()
  }

  @objc func getProductsForCollection(_ collectionId: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let query = Storefront.buildQuery { $0
      .node(id: GraphQL.ID(rawValue: collectionId as String)) { $0
        .onCollection { $0
          .products(first: 250) { $0
            .edges { $0
              .node { $0
                .id()
                .description()
                .descriptionHtml()
                .title()
                .createdAt()
                .handle()
                .options { $0
                  .id()
                  .name()
                  .values()
                }
                .variants(first: 250) { $0
                  .edges { $0
                    .node { $0
                      .id()
                      .compareAtPriceV2 { $0
                        .amount()
                        .currencyCode()
                      }
                      .priceV2 { $0
                        .amount()
                        .currencyCode()
                      }
                      .sku()
                      .title()
                      .weight()
                      .weightUnit()
                      .availableForSale()
                      .selectedOptions { $0
                        .name()
                        .value()
                      }
                    }
                  }
                }
                .images(first: 250) { $0
                  .edges { $0
                    .node { $0
                      .id()
                      .url()
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
    client?.queryGraphWith(query) { query, error in
      if let fields = query?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error getting products from collection", error)
      }
    }.resume()
  }

  @objc func createCheckoutWithCartAndClientInfo(_ cart: NSArray, userInfo: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let lineItems = cart.map { item -> Storefront.CheckoutLineItemInput in
      let i = item as! NSDictionary
      return Storefront.CheckoutLineItemInput.create(quantity: Int32(i["quantity"] as! Int64), variantId: GraphQL.ID(rawValue: i["id"] as! String))
    }

    let address1 = userInfo["address1"] as? String ?? ""
    let address2 = userInfo["address2"] as? String ?? ""
    let city = userInfo["city"] as? String ?? ""
    let company = userInfo["company"] as? String ?? ""
    let country = userInfo["countryName"] as? String ?? ""
    let firstName = userInfo["firstName"] as? String ?? ""
    let lastName = userInfo["lastName"] as? String ?? ""
    let phone = userInfo["phone"] as? String ?? ""
    let province = userInfo["province"] as? String ?? ""
    let zip = userInfo["zip"] as? String ?? ""
    let email = userInfo["email"] as? String ?? ""

    shippingAddress = Storefront.MailingAddressInput.create(
      address1: Input.value(address1),
      address2: Input.value(address2),
      city: Input.value(city),
      company: Input.value(company),
      country: Input.value(country),
      firstName: Input.value(firstName),
      lastName: Input.value(lastName),
      phone: Input.value(phone),
      province: Input.value(province),
      zip: Input.value(zip)
    )

    let checkoutInput = Storefront.CheckoutCreateInput.create(
      email: Input.value(email),
      lineItems: Input.value(lineItems),
      shippingAddress: Input.value(shippingAddress)
    )

    let mutation = Storefront.buildMutation { $0
      .checkoutCreate(input: checkoutInput) { $0
        .checkout { $0
          .id()
          .webUrl()
          .paymentDueV2 { $0
            .amount()
            .currencyCode()
          }
          .requiresShipping()
          .availableShippingRates { $0
            .ready().shippingRates { $0
              .handle()
              .title()
              .priceV2 { $0
                .amount()
                .currencyCode()
              }
            }
          }
        }
        .checkoutUserErrors { $0
          .field()
          .message()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
        if let checkoutCreate = response?.checkoutCreate?.checkout {
          self.checkoutId = checkoutCreate.id
          self.webUrl = checkoutCreate.webUrl
        }
      }
      if let error = error {
        reject("error", "Error creating checkout with credit card info", error)
      }
    }.resume()
  }

  @objc func associateCheckout(_ checkoutID: String, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) {
    let id = GraphQL.ID(rawValue: checkoutID)

    guard let token = MBBridge.getAccessToken() else {
      return reject("error", "Unable to login", nil)
    }

    let accessToken = String(decoding: token, as: UTF8.self)

    let mutation = Storefront.buildMutation { $0
      .checkoutCustomerAssociateV2(checkoutId: id, customerAccessToken: accessToken) { $0
        .checkoutUserErrors { $0
          .field()
          .message()
        }
        .checkout { $0
          .id()
          .webUrl()
        }
      }
    }

    client?.mutateGraphWith(mutation) { response, error in
      if let fields = response?.fields {
        resolve(fields)
      }
      if let error = error {
        reject("error", "Error associating customer", error)
      }
    }.resume()
  }

  // UTILS
  static func saveAccessToken(_ data: String) {
    if let accessTokenData = data.data(using: .utf8) {
      let query = [
        kSecValueData: accessTokenData,
        kSecClass: kSecClassGenericPassword,
        kSecAttrService: "access-token",
        kSecAttrAccount: "Shopify",
      ] as CFDictionary

      let status = SecItemAdd(query, nil)

      if status == errSecDuplicateItem {
        // Update existing token
        let query = [
          kSecAttrService: "access-token",
          kSecAttrAccount: "Shopify",
          kSecClass: kSecClassGenericPassword,
        ] as CFDictionary

        let attributesToUpdate = [kSecValueData: data] as CFDictionary

        SecItemUpdate(query, attributesToUpdate)
      }

      if status != errSecSuccess {
        print("Keychain error: \(status)")
      }
    }
  }

  static func getAccessToken() -> Data? {
    let query = [
      kSecAttrService: "access-token",
      kSecAttrAccount: "Shopify",
      kSecClass: kSecClassGenericPassword,
      kSecReturnData: true,
    ] as CFDictionary

    var result: AnyObject?
    SecItemCopyMatching(query, &result)

    return (result as? Data)
  }

  static func deleteAccessToken() {
    let query = [
      kSecAttrService: "access-token",
      kSecAttrAccount: "Shopify",
      kSecClass: kSecClassGenericPassword,
    ] as CFDictionary

    SecItemDelete(query)
  }

  static func queryForCollections(_ limit: Int, cursor: String? = nil) -> Storefront.QueryRootQuery {
    return Storefront.buildQuery { $0
      .collections(first: Int32(limit), after: cursor) { $0
        .pageInfo { $0
          .hasNextPage()
        }
        .edges { $0
          .cursor()
          .node { $0
            .id()
            .title()
            .descriptionHtml()
            .image { $0
              .url()
            }
          }
        }
      }
    }
  }

  static func queryForProducts(_ limit: Int, query: String? = nil) -> Storefront.QueryRootQuery {
    return Storefront.buildQuery { $0
      .products(first: Int32(limit), query: query) { $0
        .edges { $0
          .node { $0
            .id()
            .description()
            .descriptionHtml()
            .title()
            .createdAt()
            .handle()
            .options { $0
              .id()
              .name()
              .values()
            }
            .variants(first: 250) { $0
              .edges { $0
                .node { $0
                  .id()
                  .compareAtPriceV2 { $0
                    .amount()
                    .currencyCode()
                  }
                  .priceV2 { $0
                    .amount()
                    .currencyCode()
                  }
                  .sku()
                  .title()
                  .weight()
                  .weightUnit()
                  .availableForSale()
                  .selectedOptions { $0
                    .name()
                    .value()
                  }
                }
              }
            }
            .images(first: 250) { $0
              .edges { $0
                .node { $0
                  .id()
                  .url()
                }
              }
            }
          }
        }
      }
    }
  }
}
