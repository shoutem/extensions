package com.shoutem.shopify;

import androidx.annotation.NonNull;
import androidx.annotation.Nullable;
import android.util.Log;

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
import com.shopify.buy3.GraphCall;
import com.shopify.buy3.GraphClient;
import com.shopify.buy3.GraphError;
import com.shopify.buy3.GraphResponse;
import com.shopify.buy3.RetryHandler;
import com.shopify.buy3.Storefront;
import com.shopify.buy3.CreditCardVaultCall;
import com.shopify.graphql.support.ID;

import java.io.IOException;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

public class ShopifyModule extends ReactContextBaseJavaModule {

    private GraphClient client;
    private Storefront.MailingAddressInput mailingAddressInput;
    private ID checkoutId;
    private String webUrl;
    private BigDecimal paymentDue;
    private String cardVaultUrl;
    private static final Gson gson = new Gson();

    public ShopifyModule(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "MBBridge";
    }

    // TODO: replace Callback with Promise
    @ReactMethod
    public void initStore(String shopDomain, String apiKey, Callback callback) {
        client = GraphClient
                .builder(this.getReactApplicationContext())
                .shopDomain(shopDomain)
                .accessToken(apiKey)
                .build();
        callback.invoke(true);
    }

    @ReactMethod
    public void getShop(Promise promise) {
        Storefront.QueryRootQuery q = Storefront.query(query -> query.shop(shop -> shop
                .name()
                .moneyFormat()
                .paymentSettings(p -> p.cardVaultUrl())
        ));
        try {
            Storefront.QueryRoot response = client.queryGraph(q).execute().data();
            this.cardVaultUrl = response.getShop().getPaymentSettings().getCardVaultUrl();
            promise.resolve(this.gson.toJson(response.getShop()));
        } catch (GraphError graphError) {
            graphError.printStackTrace();
            promise.reject(graphError);
        }
    }

    @ReactMethod
    public void getCollections(String cursor, Promise promise) {
        final String cursorValue = cursor.length() == 0 ? null : cursor;
        Storefront.QueryRootQuery query = Storefront.query(q -> q.shop(shop ->
            shop.collections(args -> args
                // TODO: implement pagination, high priority
                .first(250)
                .after(cursorValue),
              collections -> collections
                .pageInfo(pInfo -> pInfo
                  .hasNextPage()
                )
                .edges(edge -> edge
                  .cursor()
                  .node(collection -> collection
                    .handle()
                    .title()
                    .description()
                    .image(i -> i.src())
                  )
                )
              )
            )
          );

        try {
            Storefront.QueryRoot response = client.queryGraph(query).execute().data();
            promise.resolve(new Gson().toJson(response.getShop()));
        } catch (GraphError graphError) {
            graphError.printStackTrace();
        }
    }

    @ReactMethod
    public void filterProducts(String filter, Promise promise) {
        Storefront.QueryRootQuery query = Storefront.query(q -> q.shop(shop ->
                shop.products(args -> args.first(250).query(filter), edges -> edges.edges(edge -> edge.node(pNode ->
                    pNode.description().descriptionHtml().title().createdAt().handle().options(o -> o.name().values())
                            .images(args -> args.first(250), iEdges -> iEdges.edges(iEdge -> iEdge.node(iNode ->
                                    iNode.src()
                            )))
                            .variants(args -> args.first(250), vEdges -> vEdges.edges(vEdge -> vEdge.node(vNode ->
                                    vNode.compareAtPrice().availableForSale().price().sku().title()
                                            .weight().weightUnit().selectedOptions(so -> so.name().value())
                            )))
                )))));
        try {
            Storefront.QueryRoot response = client.queryGraph(query).execute().data();
            promise.resolve(this.gson.toJson(response.getShop()));
        } catch (GraphError graphError) {
            graphError.printStackTrace();
            promise.reject(graphError);
        }
    }

    @ReactMethod
    public void getProductsForCollection(String collectionId, Promise promise) {
        Storefront.QueryRootQuery query = Storefront.query(q ->
                q.node(new ID(collectionId), node -> node.onCollection(collection ->
                        collection.products(args -> args.first(250), edges -> edges.edges(edge -> edge.node(pNode ->
                                pNode.description().descriptionHtml().title().createdAt().handle().options(o -> o.name().values())
                                        .images(args -> args.first(250), iEdges -> iEdges.edges(iEdge -> iEdge.node(iNode ->
                                                iNode.src()
                                        )))
                                        .variants(args -> args.first(250), vEdges -> vEdges.edges(vEdge -> vEdge.node(vNode ->
                                                vNode.compareAtPrice().availableForSale().price().sku().title()
                                                        .weight().weightUnit().selectedOptions(so -> so.name().value())
                                        )))
                        )))
                ))
        );
        try {
            Storefront.QueryRoot response = client.queryGraph(query).execute().data();
            promise.resolve(this.gson.toJson(response));
        } catch (GraphError graphError) {
            graphError.printStackTrace();
            promise.reject(graphError);
        }
    }

    private String getString(ReadableMap map, String key) {
        try {
            return map.getString(key);
        } catch (Exception e) {
            return "";
        }
    }

    @ReactMethod
    public void createCheckoutWithCartAndClientInfo(ReadableArray cart, ReadableMap userInfo, Promise promise) {
        Storefront.CheckoutCreateInput checkoutCreateInput = new Storefront.CheckoutCreateInput();
        ArrayList<Storefront.CheckoutLineItemInput> lineItems = new ArrayList<>();
        for (int i = 0; i < cart.size(); i++) {
            ReadableMap map = cart.getMap(i);
            lineItems.add(new Storefront.CheckoutLineItemInput(map.getInt("quantity"), new ID(map.getString("id"))));
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
                mQuery.checkoutCreate(checkoutCreateInput, checkoutCreate ->
                        checkoutCreate.checkout(checkout ->
                                checkout.webUrl().paymentDue().requiresShipping().availableShippingRates(availableShippingRates ->
                                        availableShippingRates.ready().shippingRates(shippingRates ->
                                                shippingRates.handle().title().price()
                                        )
                                )
                        ).userErrors(e ->
                                e.field().message()
                        )
                )
        );

        try {
            Storefront.Mutation response = client.mutateGraph(mutation).execute().data();
            if (response.getCheckoutCreate().getUserErrors().isEmpty()) {
                this.webUrl = response.getCheckoutCreate().getCheckout().getWebUrl();
                this.checkoutId = response.getCheckoutCreate().getCheckout().getId();
                this.paymentDue = response.getCheckoutCreate().getCheckout().getPaymentDue();
            }
            promise.resolve(this.gson.toJson(response));
        } catch (GraphError graphError) {
            graphError.printStackTrace();
            promise.reject(graphError);
        }

    }

}
