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
    private Storefront.MoneyV2 paymentDue;
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
        Storefront.QueryRootQuery query = Storefront.query(q -> q.collections(args -> args
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
                    .image(i -> i.url())
                  )
                )
              )
            );


            client.queryGraph(query).enqueue(result -> {
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
        Storefront.QueryRootQuery query = Storefront.query(q -> q.products(
            args -> args.first(250).query(filter), edges -> edges.edges(edge -> edge.node(pNode ->
                    pNode.description().descriptionHtml().title().createdAt().handle().options(o -> o.name().values())
                            .images(args -> args.first(250), iEdges -> iEdges.edges(iEdge -> iEdge.node(iNode ->
                                    iNode.url()
                            )))
                            .variants(args -> args.first(250), vEdges -> vEdges.edges(vEdge -> vEdge.node(vNode ->
                                    vNode.compareAtPriceV2(price -> price.amount().currencyCode()).availableForSale().priceV2(price -> price.amount().currencyCode()).sku().title()
                                            .weight().weightUnit().selectedOptions(so -> so.name().value())
                            )))
                ))));

                client.queryGraph(query).enqueue(result -> {
                    if (result instanceof GraphCallResult.Success) {
                        promise.resolve(this.gson.toJson(((GraphCallResult.Success<Storefront.QueryRoot>) result).getResponse().getData()));
                    } else {
                        promise.reject(((GraphCallResult.Failure) result).getError());
                    }
                    return Unit.INSTANCE;
                  });
    }

    @ReactMethod
    public void getProductsForCollection(String collectionId, Promise promise) {
        Storefront.QueryRootQuery query = Storefront.query(q ->
                q.node(new ID(collectionId), node -> node.onCollection(collection ->
                        collection.products(args -> args.first(250), edges -> edges.edges(edge -> edge.node(pNode ->
                                pNode.description().descriptionHtml().title().createdAt().handle().options(o -> o.name().values())
                                        .images(args -> args.first(250), iEdges -> iEdges.edges(iEdge -> iEdge.node(iNode ->
                                                iNode.url()
                                        )))
                                        .variants(args -> args.first(250), vEdges -> vEdges.edges(vEdge -> vEdge.node(vNode ->
                                                vNode.compareAtPriceV2(price -> price.amount().currencyCode()).availableForSale().priceV2(price -> price.amount().currencyCode()).sku().title()
                                                        .weight().weightUnit().selectedOptions(so -> so.name().value())
                                        )))
                        )))
                ))
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
    public void createCheckoutWithCartAndClientInfo(ReadableArray cart, ReadableMap userInfo, Promise promise) {
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
                mQuery.checkoutCreate(checkoutCreateInput, checkoutCreate ->
                        checkoutCreate.checkout(checkout ->
                                checkout.webUrl().paymentDueV2(price -> price.amount().currencyCode()).requiresShipping().availableShippingRates(availableShippingRates ->
                                        availableShippingRates.ready().shippingRates(shippingRates ->
                                                shippingRates.handle().title().priceV2(price -> price.amount().currencyCode())
                                        )
                                )
                        ).checkoutUserErrors(e ->
                                e.field().message()
                        )
                )
        );

        client.mutateGraph(mutation).enqueue(result -> {
            if (result instanceof GraphCallResult.Success) {
                if (((GraphCallResult.Success<Storefront.Mutation>) result).getResponse().getData().getCheckoutCreate().getCheckoutUserErrors().isEmpty()) {
                    this.webUrl = ((GraphCallResult.Success<Storefront.Mutation>) result).getResponse().getData().getCheckoutCreate().getCheckout().getWebUrl();
                    this.checkoutId = ((GraphCallResult.Success<Storefront.Mutation>) result).getResponse().getData().getCheckoutCreate().getCheckout().getId();
                    this.paymentDue = ((GraphCallResult.Success<Storefront.Mutation>) result).getResponse().getData().getCheckoutCreate().getCheckout().getPaymentDueV2();
                }

                promise.resolve(this.gson.toJson(((GraphCallResult.Success<Storefront.Mutation>) result).getResponse().getData()));
            } else {
                promise.reject(((GraphCallResult.Failure) result).getError());
            }
            return Unit.INSTANCE;
          });
    }

}
