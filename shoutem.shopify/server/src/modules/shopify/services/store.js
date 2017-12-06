import validator from 'validator';

const protocolRegex = /^https?:\/\//i;

/**
 * A helper function that removes http or https protocol from the store URL.
 * This is used only for situations where a user accidentally copies his entire
 * Shopify store URL and not just the domain (somestore.myshopify.com)
 */
export function resolveShopifyStoreUrl(url) {
  return url.replace(protocolRegex, '');
}

export function validateShopifyStoreUrl(url) {
  return validator.isURL(url);
}
