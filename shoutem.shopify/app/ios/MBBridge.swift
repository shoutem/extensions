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
    fileprivate var paymentDue: Decimal?
    fileprivate var webUrl: URL?

    @objc func initStore(_ shopDomain: NSString, apiKey: NSString, callback: @escaping (NSArray) -> ()) -> Void {
        self.client = Graph.Client.init(shopDomain: shopDomain as String, apiKey: apiKey as String)
        callback([true])
    }

    @objc func getShop(_ resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {

        let clientQuery = Storefront.buildQuery{ $0
            .shop({ $0
                .name()
                .moneyFormat()
                .paymentSettings() { $0
                    .cardVaultUrl()
                }
            })
        }
        self.client?.queryGraphWith(clientQuery) { (response, error) in
          if let shop = response?.fields["shop"] {
              resolve(shop)
              self.paymentSettings = response?.shop.paymentSettings
          } else {
            let error = error;
            switch error {
              case .http(let statusCode)?:
                print("Shopify query failed: HTTP error code: \(statusCode)")
              case .none:
                print("Shopify query failed: none")
            case .some(.request(let _)):
                print("Shopify query failed: request errors")
              case .some(.noData):
                print("Shopify query failed: noData")
            case .some(.jsonDeserializationFailed(let _)):
                print("Shopify query failed: jsonDeserializationFailed")
            case .some(.invalidJson(let _)):
                print("Shopify query failed: invalidJson")
            case .some(.invalidQuery(let _)):
                print("Shopify query failed: invalidQuery")
            case .some(.schemaViolation(let _)):
                print("Shopify query failed: schemaViolation")
            }
            print(error as Any)
          }

          if let error = error {
            reject("error", "Error loading shop", error)
          }


        }.resume()
    }

    @objc func getCollections(_ cursor: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        let cursorValue = cursor == "" ? nil : cursor as String
        self.client?.queryGraphWith(MBBridge.queryForCollections(250, cursor:cursorValue)) {(query, error) in
            if let collections = query?.fields["shop"] {
                resolve(collections)
            }
            if let error = error {
              reject("error", "Error getting collections", error)
            }
            }.resume()
    }

    @objc func filterProducts(_ query: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        self.client?.queryGraphWith(MBBridge.queryForProducts(250, query:query as String)) {(query, error) in
            if let products = query?.fields["shop"] {
                resolve(products)
            }
            if let error = error {
                reject("error", "Error filtering products", error)
            }
            }.resume()
    }

    @objc func getProductsForCollection(_ collectionId: NSString, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        let query = Storefront.buildQuery { $0
            .node(id: GraphQL.ID(rawValue: collectionId as String)) { $0
                .onCollection { $0
                    .products(first: 250) {$0
                        .edges {$0
                            .node {$0
                                .id()
                                .description()
                                .descriptionHtml()
                                .title()
                                .createdAt()
                                .handle()
                                .options() { $0
                                    .id()
                                    .name()
                                    .values()
                                }
                                .variants(first: 250) { $0
                                    .edges() {$0
                                        .node() { $0
                                            .id()
                                            .compareAtPrice()
                                            .price()
                                            .sku()
                                            .title()
                                            .weight()
                                            .weightUnit()
                                            .availableForSale()
                                            .selectedOptions() { $0
                                                .name()
                                                .value()
                                            }
                                        }
                                    }
                                }
                                .images(first: 250) { $0
                                    .edges() { $0
                                        .node() { $0
                                            .id()
                                            .src()
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        };
        self.client?.queryGraphWith(query) {(query, error) in
            if let fields = query?.fields {
                resolve(fields)
            }
            if let error = error {
                reject("error", "Error getting products from collection", error)
            }
            }.resume()
    }

    @objc func createCheckoutWithCartAndClientInfo(_ cart: NSArray, userInfo: NSDictionary, resolver resolve: @escaping RCTPromiseResolveBlock, rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {

        let lineItems = cart.map { item -> Storefront.CheckoutLineItemInput in
            let i = item as! NSDictionary
            return Storefront.CheckoutLineItemInput.create(quantity: Int32(i["quantity"] as! Int64), variantId: GraphQL.ID(rawValue: i["id"] as! String));
        }

        let address1 = userInfo["address1"] as? String ?? "";
        let address2 = userInfo["address2"] as? String ?? "";
        let city = userInfo["city"] as? String ?? "";
        let company = userInfo["company"] as? String ?? "";
        let country = userInfo["countryName"] as? String ?? "";
        let firstName = userInfo["firstName"] as? String ?? "";
        let lastName = userInfo["lastName"] as? String ?? "";
        let phone = userInfo["phone"] as? String ?? "";
        let province = userInfo["province"] as? String ?? "";
        let zip = userInfo["zip"] as? String ?? "";
        let email = userInfo["email"] as? String ?? "";

        self.shippingAddress = Storefront.MailingAddressInput.create(
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
        );

        let checkoutInput = Storefront.CheckoutCreateInput.create(
            email: Input.value(email),
            lineItems: Input.value(lineItems),
            shippingAddress: Input.value(shippingAddress)
        );

        let mutation = Storefront.buildMutation { $0
            .checkoutCreate(input: checkoutInput) { $0
                .checkout() { $0
                    .id()
                    .webUrl()
                    .paymentDue()
                    .requiresShipping()
                    .availableShippingRates() { $0
                        .ready().shippingRates() { $0
                            .handle()
                            .title()
                            .price()
                        }
                    }
                }
                .userErrors() { $0
                    .field()
                    .message()
                }
            }
        }

        self.client?.mutateGraphWith(mutation) { response, error in
            if let fields = response?.fields {
                resolve(fields);
                if let checkoutCreate = response?.checkoutCreate?.checkout {
                    self.checkoutId = checkoutCreate.id;
                    self.paymentDue = checkoutCreate.paymentDue;
                    self.webUrl = checkoutCreate.webUrl;
                }

            }
            if let error = error {
                reject("error", "Error creating checkout with credit card info", error)
            }
            }.resume()

    }


    // UTILS
    static func queryForCollections(_ limit: Int, cursor: String? = nil) -> Storefront.QueryRootQuery {
        return Storefront.buildQuery { $0
            .shop { $0
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
                            .image() { $0
                                .src()
                            }
                        }
                    }
                }
            }
        }
    }

    static func queryForProducts(_ limit: Int, query: String? = nil) -> Storefront.QueryRootQuery {
        return Storefront.buildQuery { $0
            .shop { $0
                .products(first: Int32(limit), query: query) { $0
                    .edges {$0
                        .node {$0
                            .id()
                            .description()
                            .descriptionHtml()
                            .title()
                            .createdAt()
                            .handle()
                            .options() { $0
                                .id()
                                .name()
                                .values()
                            }
                            .variants(first: 250) { $0
                                .edges() {$0
                                    .node() { $0
                                        .id()
                                        .compareAtPrice()
                                        .price()
                                        .sku()
                                        .title()
                                        .weight()
                                        .weightUnit()
                                        .availableForSale()
                                        .selectedOptions() { $0
                                            .name()
                                            .value()
                                        }
                                    }
                                }
                            }
                            .images(first: 250) { $0
                                .edges() { $0
                                    .node() { $0
                                        .id()
                                        .src()
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

}
