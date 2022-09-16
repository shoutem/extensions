const SHOP_NAME_REGEX = /^[a-zA-Z0-9][a-zA-Z0-9\-]*.myshopify.com/;

export function validateShopifyStoreUrl(url) {
  const shopNameValid = url.match(SHOP_NAME_REGEX);

  return !!shopNameValid;
}
