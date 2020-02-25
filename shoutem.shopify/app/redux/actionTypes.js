/**
 * @namespace ShopifyActionTypes
 * Redux action types dispatched by Shoutem Shopify extension.
 */

/**
 @typedef SHOP_LOADING
 @type {object}
 */
export const SHOP_LOADING = 'shoutem.shopify.SHOP_LOADING';

/**
 @typedef SHOP_LOADED
 @type {object}
 @property payload {collections: [], currency: string, tags: []} Data
 */
export const SHOP_LOADED = 'shoutem.shopify.SHOP_LOADED';

/**
 @typedef SHOP_ERROR_LOADING
 @type {object}
 */
export const SHOP_ERROR_LOADING = 'shoutem.shopify.SHOP_ERROR_LOADING';

/**
 @typedef CART_ITEM_ADDED
 @type {object}
 @property payload {item: {}, variant: {}, quantity: number} Cart item
 */
export const CART_ITEM_ADDED = 'shoutem.shopify.CART_ITEM_ADDED';

/**
 @typedef CART_ITEM_REMOVED
 @type {object}
 @property payload {item: {}, variant: {}, quantity: number} Cart item
 */
export const CART_ITEM_REMOVED = 'shoutem.shopify.CART_ITEM_REMOVED';

/**
 @typedef CART_ITEM_UPDATED
 @type {object}
 @property payload {item: {}, variant: {}, quantity: number} Cart item
 */
export const CART_ITEM_UPDATED = 'shoutem.shopify.CART_ITEM_UPDATED';

/**
 @typedef PRODUCTS_LOADING
 @type {object}
 @property payload { collectionId: number, tag: string } Parameters
 */
export const PRODUCTS_LOADING = 'shoutem.shopify.PRODUCTS_LOADING';

/**
 @typedef PRODUCTS_LOADED
 @type {object}
 @property payload { products: [], collectionId: number, tag: string, page: number,
   resetMode: boolean } Data
 */
export const PRODUCTS_LOADED = 'shoutem.shopify.PRODUCTS_LOADED';

/**
 @typedef PRODUCTS_ERROR
 @type {object}
 @property payload { collectionId: number, tag: string } Parameters
 */
export const PRODUCTS_ERROR = 'shoutem.shopify.PRODUCTS_ERROR';

/**
 @typedef CUSTOMER_INFORMATION_UPDATED
 @type {object}
 @property payload { customer: { email: string, firstName: string, lastName: string,
    address: string, city: string, countryCode: string, zip: string }} Customer information
 */
export const CUSTOMER_INFORMATION_UPDATED = 'shoutem.shopify.CUSTOMER_INFORMATION_UPDATED';

/**
 @typedef ORDER_NUMBER_LOADED
 @type {object}
 @property payload { orderNumber: {} } The order number
 */
export const ORDER_NUMBER_LOADED = 'shoutem.shopify.ORDER_NUMBER_LOADED';

/**
 @typedef CHECKOUT_COMPLETED
 @type {object}
 */
export const CHECKOUT_COMPLETED = 'shoutem.shopify.CHECKOUT_COMPLETED';

/**
 @typedef APP_MOUNTED
 @type {object}
 */
export const APP_MOUNTED = 'shoutem.shopify.APP_MOUNTED';
