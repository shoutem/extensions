package com.shoutem.shopify;

import android.content.Context;
import android.content.SharedPreferences;
import android.util.Log;
import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.shopify.buy3.CardClient;
import com.shopify.buy3.CreditCard;
import com.shopify.buy3.CreditCardVaultCall;
import com.shopify.buy3.GraphCall;
import com.shopify.buy3.GraphCallResult;
import com.shopify.buy3.GraphClient;
import com.shopify.buy3.GraphError;
import com.shopify.buy3.GraphResponse;
import com.shopify.buy3.QueryGraphCall;
import com.shopify.buy3.RetryHandler;
import com.shopify.buy3.Storefront;
import com.shopify.graphql.support.ID;
import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;
import java.util.concurrent.TimeUnit;
import kotlin.Unit;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ShopifyModule extends ReactContextBaseJavaModule {

    private GraphClient client;
    private Storefront.MailingAddressInput mailingAddressInput;
    private ID checkoutId;
    private String webUrl;
    private String cardVaultUrl;
    private static final Gson gson = new Gson();

    public static final String KEYCHAIN = "com.shoutem.shopify";
    private final SharedPreferences preferences;

    public ShopifyModule(ReactApplicationContext reactContext) {
        super(reactContext);
        this.preferences =
            reactContext.getSharedPreferences(KEYCHAIN, Context.MODE_PRIVATE);
    }

    @Override
    public String getName() {
        return "MBBridge";
    }

    // TODO: replace Callback with Promise
    @ReactMethod
    public void initStore(String shopDomain, String apiKey, Callback callback) {
        client =
            GraphClient.Companion.build(
                this.getReactApplicationContext(),
                shopDomain,
                apiKey,
                builder -> {
                    return Unit.INSTANCE;
                }
            );
        callback.invoke(true);
    }

    @ReactMethod
    public void getShop(Promise promise) {
        Storefront.QueryRootQuery q = Storefront.query(query ->
            query.shop(shop ->
                shop.name().moneyFormat().paymentSettings(p -> p.cardVaultUrl())
            )
        );

        client
            .queryGraph(q)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    this.cardVaultUrl =
                        (
                            (GraphCallResult.Success<Storefront.QueryRoot>) result
                        ).getResponse()
                            .getData()
                            .getShop()
                            .getPaymentSettings()
                            .getCardVaultUrl();
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.QueryRoot>) result
                                ).getResponse()
                                    .getData()
                                    .getShop()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void getCollections(String cursor, Promise promise) {
        final String cursorValue = cursor.length() == 0 ? null : cursor;
        Storefront.QueryRootQuery query = Storefront.query(q ->
            q.collections(
                args ->
                    args
                        // TODO: implement pagination, high priority
                        .first(250)
                        .after(cursorValue),
                collections ->
                    collections
                        .pageInfo(pInfo -> pInfo.hasNextPage())
                        .edges(edge ->
                            edge
                                .cursor()
                                .node(collection ->
                                    collection
                                        .handle()
                                        .title()
                                        .description()
                                        .image(i -> i.url())
                                )
                        )
            )
        );

        client
            .queryGraph(query)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        new Gson()
                            .toJson(
                                (
                                    (GraphCallResult.Success<Storefront.QueryRoot>) result
                                ).getResponse()
                                    .getData()
                                    .getCollections()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void filterProducts(String filter, Promise promise) {
        Storefront.QueryRootQuery query = Storefront.query(q ->
            q.products(
                args -> args.first(250).query(filter),
                edges ->
                    edges.edges(edge ->
                        edge.node(pNode ->
                            pNode
                                .description()
                                .descriptionHtml()
                                .title()
                                .createdAt()
                                .handle()
                                .options(o -> o.name().values())
                                .images(
                                    args -> args.first(250),
                                    iEdges ->
                                        iEdges.edges(iEdge ->
                                            iEdge.node(iNode -> iNode.url())
                                        )
                                )
                                .variants(
                                    args -> args.first(250),
                                    vEdges ->
                                        vEdges.edges(vEdge ->
                                            vEdge.node(vNode ->
                                                vNode
                                                    .compareAtPriceV2(price ->
                                                        price
                                                            .amount()
                                                            .currencyCode()
                                                    )
                                                    .availableForSale()
                                                    .priceV2(price ->
                                                        price
                                                            .amount()
                                                            .currencyCode()
                                                    )
                                                    .sku()
                                                    .title()
                                                    .weight()
                                                    .weightUnit()
                                                    .selectedOptions(so ->
                                                        so.name().value()
                                                    )
                                            )
                                        )
                                )
                        )
                    )
            )
        );

        client
            .queryGraph(query)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.QueryRoot>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void getProductsForCollection(String collectionId, Promise promise) {
        Storefront.QueryRootQuery query = Storefront.query(q ->
            q.node(
                new ID(collectionId),
                node ->
                    node.onCollection(collection ->
                        collection.products(
                            args -> args.first(250),
                            edges ->
                                edges.edges(edge ->
                                    edge.node(pNode ->
                                        pNode
                                            .description()
                                            .descriptionHtml()
                                            .title()
                                            .createdAt()
                                            .handle()
                                            .options(o -> o.name().values())
                                            .images(
                                                args -> args.first(250),
                                                iEdges ->
                                                    iEdges.edges(iEdge ->
                                                        iEdge.node(iNode ->
                                                            iNode.url()
                                                        )
                                                    )
                                            )
                                            .variants(
                                                args -> args.first(250),
                                                vEdges ->
                                                    vEdges.edges(vEdge ->
                                                        vEdge.node(vNode ->
                                                            vNode
                                                                .compareAtPriceV2(price ->
                                                                    price
                                                                        .amount()
                                                                        .currencyCode()
                                                                )
                                                                .availableForSale()
                                                                .priceV2(price ->
                                                                    price
                                                                        .amount()
                                                                        .currencyCode()
                                                                )
                                                                .sku()
                                                                .title()
                                                                .weight()
                                                                .weightUnit()
                                                                .selectedOptions(so ->
                                                                    so
                                                                        .name()
                                                                        .value()
                                                                )
                                                        )
                                                    )
                                            )
                                    )
                                )
                        )
                    )
            )
        );
        client
            .queryGraph(query)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.QueryRoot>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    private String getString(ReadableMap map, String key) {
        try {
            return map.getString(key);
        } catch (Exception e) {
            return "";
        }
    }

    @ReactMethod
    public void createCustomer(ReadableMap customerQuery, Promise promise) {
        Storefront.CustomerCreateInput input = new Storefront.CustomerCreateInput(
            getString(customerQuery, "email"),
            getString(customerQuery, "password")
        )
            .setFirstName(getString(customerQuery, "firstName"))
            .setLastName(getString(customerQuery, "lastName"));

        Storefront.MutationQuery mutationQuery = Storefront.mutation(mutation ->
            mutation.customerCreate(
                input,
                query ->
                    query
                        .customer(customer ->
                            customer.id().email().firstName().lastName()
                        )
                        .customerUserErrors(userError ->
                            userError.field().message()
                        )
            )
        );

        client
            .mutateGraph(mutationQuery)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    public void saveAccessToken(String token) {
        this.preferences.edit().putString("access-token", token).apply();
    }

    public String getAccessToken() {
        return this.preferences.getString("access-token", "");
    }

    public void deleteAccessToken() {
        this.preferences.edit().putString("access-token", "").apply();
    }

    @ReactMethod
    public void logout(Promise promise) {
        this.deleteAccessToken();
        promise.resolve(true);
    }

    @ReactMethod
    // TODO: Not working properly - always resolves to true
    public void isLoggedIn(Promise promise) {
        final String accessToken = this.getAccessToken();
        promise.resolve(accessToken != null);
    }

    @ReactMethod
    public void login(ReadableMap customerQuery, Promise promise) {
        Storefront.CustomerAccessTokenCreateInput input = new Storefront.CustomerAccessTokenCreateInput(
            getString(customerQuery, "email"),
            getString(customerQuery, "password")
        );

        Storefront.MutationQuery mutationQuery = Storefront.mutation(mutation ->
            mutation.customerAccessTokenCreate(
                input,
                query ->
                    query
                        .customerAccessToken(customerAccessToken ->
                            customerAccessToken.accessToken().expiresAt()
                        )
                        .customerUserErrors(userError ->
                            userError.field().message()
                        )
            )
        );

        client
            .mutateGraph(mutationQuery)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    if (
                        (
                            (GraphCallResult.Success<Storefront.Mutation>) result
                        ).getResponse()
                            .getData()
                            .getCustomerAccessTokenCreate()
                            .getCustomerUserErrors()
                            .isEmpty()
                    ) {
                        String token =
                            (
                                (GraphCallResult.Success<Storefront.Mutation>) result
                            ).getResponse()
                                .getData()
                                .getCustomerAccessTokenCreate()
                                .getCustomerAccessToken()
                                .getAccessToken();

                        this.saveAccessToken(token);
                    }

                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void getAccessToken(Promise promise) {
        final String accessToken = this.getAccessToken();

        if (accessToken == null) {
            promise.reject("Unable to get logged in user");
        }

        promise.resolve(accessToken);
    }

    @ReactMethod
    public void refreshToken(Promise promise) {
        final String accessToken = this.getAccessToken();

        Storefront.MutationQuery mutationQuery = Storefront.mutation(mutation ->
            mutation.customerAccessTokenRenew(
                accessToken,
                query ->
                    query
                        .customerAccessToken(customerAccessToken ->
                            customerAccessToken.accessToken().expiresAt()
                        )
                        .userErrors(userError -> userError.field().message())
            )
        );

        client
            .mutateGraph(mutationQuery)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    if (
                        (
                            (GraphCallResult.Success<Storefront.Mutation>) result
                        ).getResponse()
                            .getData()
                            .getCustomerAccessTokenRenew()
                            .getUserErrors()
                            .isEmpty()
                    ) {
                        String token =
                            (
                                (GraphCallResult.Success<Storefront.Mutation>) result
                            ).getResponse()
                                .getData()
                                .getCustomerAccessTokenRenew()
                                .getCustomerAccessToken()
                                .getAccessToken();

                        this.saveAccessToken(token);
                    }

                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    this.deleteAccessToken();

                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void getCustomer(String addressCursor, Promise promise) {
        final String accessToken = this.getAccessToken();
        final String cursorValue = addressCursor.length() == 0
            ? null
            : addressCursor;

        Storefront.QueryRootQuery query = Storefront.query(root ->
            root.customer(
                accessToken,
                customer ->
                    customer
                        .firstName()
                        .lastName()
                        .phone()
                        .email()
                        .defaultAddress(address ->
                            address
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
                                .phone()
                                .latitude()
                                .longitude()
                        )
                        .addresses(
                            args -> args.first(25).after(cursorValue),
                            vEdges ->
                                vEdges
                                    .edges(vEdge ->
                                        vEdge
                                            .cursor()
                                            .node(vNode ->
                                                vNode
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
                                                    .phone()
                                                    .latitude()
                                                    .longitude()
                                            )
                                    )
                                    .pageInfo(pInfo -> pInfo.hasNextPage())
                        )
            )
        );

        client
            .queryGraph(query)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.QueryRoot>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void updateCustomer(ReadableMap userInfo, Promise promise) {
        final String accessToken = this.getAccessToken();

        Storefront.CustomerUpdateInput input = new Storefront.CustomerUpdateInput();
        input.setFirstName(getString(userInfo, "firstName"));
        input.setLastName(getString(userInfo, "lastName"));
        input.setEmail(getString(userInfo, "email"));
        input.setPhone(getString(userInfo, "phone"));

        Storefront.MutationQuery updateCustomerMutation = Storefront.mutation(mutation ->
            mutation.customerUpdate(
                accessToken,
                input,
                query ->
                    query
                        .customer(customer -> customer.phone())
                        .customerUserErrors(userError ->
                            userError.field().message()
                        )
            )
        );

        client
            .mutateGraph(updateCustomerMutation)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void createCustomerAddress(
        ReadableMap addressInfo,
        Promise promise
    ) {
        final String accessToken = this.getAccessToken();

        Storefront.MailingAddressInput input = new Storefront.MailingAddressInput();
        input.setAddress1(getString(addressInfo, "address1"));
        input.setAddress2(getString(addressInfo, "address2"));
        input.setCity(getString(addressInfo, "city"));
        input.setCountry(getString(addressInfo, "country"));
        input.setCompany(getString(addressInfo, "company"));
        input.setFirstName(getString(addressInfo, "firstName"));
        input.setLastName(getString(addressInfo, "lastName"));
        input.setPhone(getString(addressInfo, "phone"));
        input.setProvince(getString(addressInfo, "province"));
        input.setZip(getString(addressInfo, "zip"));

        Storefront.MutationQuery customerAddressCreateMutation = Storefront.mutation(mutation ->
            mutation.customerAddressCreate(
                accessToken,
                input,
                query ->
                    query
                        .customerAddress(address ->
                            address
                                .address1()
                                .address2()
                                .city()
                                .country()
                                .company()
                                .firstName()
                                .lastName()
                                .phone()
                                .province()
                                .zip()
                        )
                        .customerUserErrors(userError ->
                            userError.field().message()
                        )
            )
        );

        client
            .mutateGraph(customerAddressCreateMutation)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void updateCustomerDefaultAddress(
        String addressId,
        Promise promise
    ) {
        final String accessToken = this.getAccessToken();
        final ID addressID = new ID(addressId);

        Storefront.MutationQuery customerAddressUpdateMutation = Storefront.mutation(mutation ->
            mutation.customerDefaultAddressUpdate(
                accessToken,
                addressID,
                query ->
                    query
                        .customer(customer -> customer.email())
                        .customerUserErrors(userError ->
                            userError.field().message()
                        )
            )
        );

        client
            .mutateGraph(customerAddressUpdateMutation)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void updateCustomerAddress(
        String addressId,
        ReadableMap addressInfo,
        Promise promise
    ) {
        final String accessToken = this.getAccessToken();

        Storefront.MailingAddressInput input = new Storefront.MailingAddressInput();
        input.setAddress1(getString(addressInfo, "address1"));
        input.setAddress2(getString(addressInfo, "address2"));
        input.setCity(getString(addressInfo, "city"));
        input.setCountry(getString(addressInfo, "country"));
        input.setCompany(getString(addressInfo, "company"));
        input.setFirstName(getString(addressInfo, "firstName"));
        input.setLastName(getString(addressInfo, "lastName"));
        input.setPhone(getString(addressInfo, "phone"));
        input.setProvince(getString(addressInfo, "province"));
        input.setZip(getString(addressInfo, "zip"));

        final ID addressID = new ID(addressId);

        Storefront.MutationQuery customerAddressUpdateMutation = Storefront.mutation(mutation ->
            mutation.customerAddressUpdate(
                accessToken,
                addressID,
                input,
                query ->
                    query
                        .customerAddress(address ->
                            address
                                .address1()
                                .address2()
                                .city()
                                .country()
                                .company()
                                .firstName()
                                .lastName()
                                .phone()
                                .province()
                                .zip()
                        )
                        .customerUserErrors(userError ->
                            userError.field().message()
                        )
            )
        );

        client
            .mutateGraph(customerAddressUpdateMutation)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void deleteCustomerAddress(String addressId, Promise promise) {
        final String accessToken = this.getAccessToken();
        final ID addressID = new ID(addressId);

        Storefront.MutationQuery customerAddressDeleteMutation = Storefront.mutation(mutation ->
            mutation.customerAddressDelete(
                addressID,
                accessToken,
                query ->
                    query
                        .deletedCustomerAddressId()
                        .customerUserErrors(userError ->
                            userError.field().message()
                        )
            )
        );

        client
            .mutateGraph(customerAddressDeleteMutation)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void getOrderByName(
        String orderName,
        String lineItemsCursor,
        Promise promise
    ) {
        final String accessToken = this.getAccessToken();
        final String cursorValue = lineItemsCursor.length() == 0
            ? null
            : lineItemsCursor;
        final String nameQuery = "name:\"" + orderName + "\"";

        Storefront.QueryRootQuery query = Storefront.query(root ->
            root.customer(
                accessToken,
                customer ->
                    customer.orders(
                        arg -> arg.first(1).query(nameQuery),
                        connection ->
                            connection
                                .edges(edge ->
                                    edge
                                        .cursor()
                                        .node(node ->
                                            node
                                                .orderNumber()
                                                .processedAt()
                                                .financialStatus()
                                                .fulfillmentStatus()
                                                .totalPriceV2(price ->
                                                    price
                                                        .amount()
                                                        .currencyCode()
                                                )
                                                .currentSubtotalPrice(price ->
                                                    price
                                                        .amount()
                                                        .currencyCode()
                                                )
                                                .totalShippingPriceV2(price ->
                                                    price
                                                        .amount()
                                                        .currencyCode()
                                                )
                                                .shippingAddress(address ->
                                                    address
                                                        .city()
                                                        .country()
                                                        .countryCodeV2()
                                                        .address1()
                                                        .address2()
                                                        .latitude()
                                                        .longitude()
                                                )
                                                .lineItems(
                                                    args ->
                                                        args
                                                            .first(25)
                                                            .after(
                                                                lineItemsCursor
                                                            ),
                                                    vEdges ->
                                                        vEdges
                                                            .edges(vEdge ->
                                                                vEdge
                                                                    .cursor()
                                                                    .node(vNode ->
                                                                        vNode
                                                                            .title()
                                                                            .currentQuantity()
                                                                            .originalTotalPrice(price ->
                                                                                price
                                                                                    .amount()
                                                                                    .currencyCode()
                                                                            )
                                                                            .discountedTotalPrice(price ->
                                                                                price
                                                                                    .amount()
                                                                                    .currencyCode()
                                                                            )
                                                                            .variant(variant ->
                                                                                variant
                                                                                    .title()
                                                                                    .image(image ->
                                                                                        image.url()
                                                                                    )
                                                                            )
                                                                    )
                                                            )
                                                            .pageInfo(pInfo ->
                                                                pInfo.hasNextPage()
                                                            )
                                                )
                                        )
                                )
                                .pageInfo(pInfo -> pInfo.hasNextPage())
                    )
            )
        );

        client
            .queryGraph(query)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.QueryRoot>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void getOrderHistory(
        Integer pageSize,
        String cursor,
        Promise promise
    ) {
        final String cursorValue = cursor.length() == 0 ? null : cursor;
        final String accessToken = this.getAccessToken();

        Storefront.QueryRootQuery query = Storefront.query(root ->
            root.customer(
                accessToken,
                customer ->
                    customer.orders(
                        arg -> arg.first(pageSize).after(cursorValue),
                        connection ->
                            connection
                                .edges(edge ->
                                    edge
                                        .cursor()
                                        .node(node ->
                                            node
                                                .orderNumber()
                                                .processedAt()
                                                .financialStatus()
                                                .fulfillmentStatus()
                                                .totalPriceV2(price ->
                                                    price
                                                        .amount()
                                                        .currencyCode()
                                                )
                                                .currentSubtotalPrice(price ->
                                                    price
                                                        .amount()
                                                        .currencyCode()
                                                )
                                                .totalShippingPriceV2(price ->
                                                    price
                                                        .amount()
                                                        .currencyCode()
                                                )
                                                .shippingAddress(address ->
                                                    address
                                                        .city()
                                                        .country()
                                                        .countryCodeV2()
                                                        .address1()
                                                        .address2()
                                                        .latitude()
                                                        .longitude()
                                                )
                                                .lineItems(
                                                    args -> args.first(25),
                                                    vEdges ->
                                                        vEdges
                                                            .edges(vEdge ->
                                                                vEdge
                                                                    .cursor()
                                                                    .node(vNode ->
                                                                        vNode
                                                                            .title()
                                                                            .currentQuantity()
                                                                            .originalTotalPrice(price ->
                                                                                price
                                                                                    .amount()
                                                                                    .currencyCode()
                                                                            )
                                                                            .discountedTotalPrice(price ->
                                                                                price
                                                                                    .amount()
                                                                                    .currencyCode()
                                                                            )
                                                                            .variant(variant ->
                                                                                variant
                                                                                    .title()
                                                                                    .image(image ->
                                                                                        image.url()
                                                                                    )
                                                                            )
                                                                    )
                                                            )
                                                            .pageInfo(pInfo ->
                                                                pInfo.hasNextPage()
                                                            )
                                                )
                                        )
                                )
                                .pageInfo(pInfo -> pInfo.hasNextPage())
                    )
            )
        );

        client
            .queryGraph(query)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.QueryRoot>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void createCheckoutWithCartAndClientInfo(
        ReadableArray cart,
        ReadableMap userInfo,
        Promise promise
    ) {
        Storefront.CheckoutCreateInput checkoutCreateInput = new Storefront.CheckoutCreateInput();
        ArrayList<Storefront.CheckoutLineItemInput> lineItems = new ArrayList<>();
        for (int i = 0; i < cart.size(); i++) {
            ReadableMap map = cart.getMap(i);
            lineItems.add(
                new Storefront.CheckoutLineItemInput(
                    map.getInt("quantity"),
                    new ID(map.getString("id"))
                )
            );
        }
        this.mailingAddressInput = new Storefront.MailingAddressInput();
        mailingAddressInput.setAddress1(getString(userInfo, "address1"));
        mailingAddressInput.setAddress2("");
        mailingAddressInput.setCity(getString(userInfo, "city"));
        mailingAddressInput.setCompany(getString(userInfo, "company"));
        mailingAddressInput.setFirstName(getString(userInfo, "firstName"));
        mailingAddressInput.setLastName(getString(userInfo, "lastName"));
        mailingAddressInput.setPhone(getString(userInfo, "phone"));
        mailingAddressInput.setProvince(getString(userInfo, "province"));
        mailingAddressInput.setZip(getString(userInfo, "zip"));
        mailingAddressInput.setCountry(getString(userInfo, "countryName"));

        checkoutCreateInput.setEmail(getString(userInfo, "email"));
        checkoutCreateInput.setLineItems(lineItems);
        checkoutCreateInput.setShippingAddress(mailingAddressInput);

        Storefront.MutationQuery mutation = Storefront.mutation(mQuery ->
            mQuery.checkoutCreate(
                checkoutCreateInput,
                checkoutCreate ->
                    checkoutCreate
                        .checkout(checkout ->
                            checkout
                                .webUrl()
                                .paymentDueV2(paymentDue ->
                                    paymentDue.amount().currencyCode()
                                )
                                .requiresShipping()
                                .availableShippingRates(availableShippingRates ->
                                    availableShippingRates
                                        .ready()
                                        .shippingRates(shippingRates ->
                                            shippingRates
                                                .handle()
                                                .title()
                                                .priceV2(price ->
                                                    price
                                                        .amount()
                                                        .currencyCode()
                                                )
                                        )
                                )
                        )
                        .checkoutUserErrors(e -> e.field().message())
            )
        );

        client
            .mutateGraph(mutation)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    if (
                        (
                            (GraphCallResult.Success<Storefront.Mutation>) result
                        ).getResponse()
                            .getData()
                            .getCheckoutCreate()
                            .getCheckoutUserErrors()
                            .isEmpty()
                    ) {
                        this.webUrl =
                            (
                                (GraphCallResult.Success<Storefront.Mutation>) result
                            ).getResponse()
                                .getData()
                                .getCheckoutCreate()
                                .getCheckout()
                                .getWebUrl();
                        this.checkoutId =
                            (
                                (GraphCallResult.Success<Storefront.Mutation>) result
                            ).getResponse()
                                .getData()
                                .getCheckoutCreate()
                                .getCheckout()
                                .getId();
                    }

                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }

    @ReactMethod
    public void associateCheckout(String checkoutID, Promise promise) {
        final String accessToken = this.getAccessToken();

        Storefront.MutationQuery checkoutMutation = Storefront.mutation(mutation ->
            mutation.checkoutCustomerAssociateV2(
                new ID(checkoutID),
                accessToken,
                query ->
                    query
                        .checkout(checkout -> checkout.webUrl())
                        .userErrors(userError -> userError.field().message())
            )
        );

        client
            .mutateGraph(checkoutMutation)
            .enqueue(result -> {
                if (result instanceof GraphCallResult.Success) {
                    promise.resolve(
                        this.gson.toJson(
                                (
                                    (GraphCallResult.Success<Storefront.Mutation>) result
                                ).getResponse()
                                    .getData()
                            )
                    );
                } else {
                    promise.reject(
                        ((GraphCallResult.Failure) result).getError()
                    );
                }
                return Unit.INSTANCE;
            });
    }
}
