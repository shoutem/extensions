import validator from 'validator';

const protocolRegex = /^https?:\/\//i;

/**
 * A helper function that removes http or https protocol from the store URL.
 * This is used only for situations where a user accidentally copies his entire
 * Shopify store URL and not just the domain (somestore.myshopify.com)
 */
export function resolveShopifyStoreUrl(url) {
  const storeUrl = url.replace(protocolRegex, '');

  if (storeUrl.endsWith('/')) {
    return storeUrl.slice(0, -1);
  }

  return storeUrl;
}

export function validateShopifyStoreUrl(url) {
  return validator.isURL(url);
}
