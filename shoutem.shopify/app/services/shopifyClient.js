import Client from 'shopify-buy';

// eslint-disable-next-line import/no-mutable-exports
let ShopifyClient = null;

function initShopifyClient(shopifyStore, apiKey) {
  ShopifyClient = Client.buildClient({
    domain: shopifyStore,
    storefrontAccessToken: apiKey,
  });
}

export { initShopifyClient, ShopifyClient };
