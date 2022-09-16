import _ from 'lodash';
import CryptoJS from 'crypto-js';
import config from '../../shared/config';

const TOKEN_SCOPE =
  'unauthenticated_read_checkouts,unauthenticated_write_checkouts,unauthenticated_read_customers,unauthenticated_write_customers,unauthenticated_read_content,unauthenticated_read_product_listings,unauthenticated_read_product_tags,unauthenticated_read_selling_plans';
const SHOP_NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/;

// construct to be env agnostic
const REDIRECT_URI = `${config.baseEndpoint}/v1/redirect`;

export function getShopifyPermanentTokenRequest(code: string, shop: string): object {
  const body = {
    client_id: config.shopifyAppClientId,
    client_secret: config.shopifyAppClientSecret,
    code,
  };

  return {
    method: 'POST',
    uri: `https://${shop}/admin/oauth/access_token`,
    headers: {
      Accept: 'application/json',
      'Content-type': 'application/json',
    },
    body: JSON.stringify(body),
  };
}

export function verifyRedirectCodes(query: object): boolean {
  const hmac = _.get(query, 'hmac');
  const shop = _.get(query, 'shop');

  const hmacRemovedQuery = _.omit(query, ['hmac']);
  const stringToHmac = _.reduce(
    hmacRemovedQuery,
    (result, value, key) => {
      const prefix = _.isEmpty(result) ? '' : '&';

      return `${result}${prefix}${key}=${value}`;
    },
    '',
  );

  const shopNameValid = shop.match(SHOP_NAME_REGEX);
  const generatedHmac = CryptoJS.HmacSHA256(stringToHmac, config.shopifyAppClientSecret).toString(CryptoJS.enc.Hex);
  const hmacValid = _.isEqual(hmac, generatedHmac);

  return !!shopNameValid && hmacValid;
}

export function getShopifyAppInstallUrl(shop: string): string {
  return `https://${shop}/admin/oauth/authorize?client_id=${config.shopifyAppClientId}&scope=${TOKEN_SCOPE}&redirect_uri=${REDIRECT_URI}`;
}

export function verifyWebhookHmac(req: any): boolean {
  const hmacHeader = req.get('X-Shopify-Hmac-SHA256');
  const reqRawBody = req.rawBody;

  const stringBody = reqRawBody.toString();

  if (!hmacHeader || !reqRawBody) {
    return false;
  }

  const stringBodyValue = CryptoJS.HmacSHA256(stringBody, config.shopifyAppClientSecret).toString(CryptoJS.enc.Base64);

  return _.isEqual(hmacHeader, stringBodyValue);
}
