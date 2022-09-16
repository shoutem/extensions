import _ from 'lodash';

export function getShopifyStorefrontTokenRequest(appId: string, shop: string, authToken: string): object {
  const body = {
    storefront_access_token: {
      title: `Storefront-Shoutem-${appId}`,
    },
  };

  return {
    method: 'POST',
    uri: `https://${shop}/admin/api/2022-07/storefront_access_tokens.json`,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
      'X-Shopify-Access-Token': authToken,
    },
    body: JSON.stringify(body),
  };
}

