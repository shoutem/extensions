/**
 * @namespace ShopifyActionTypes
 * Redux action types dispatched by Shoutem Shopify extension.
 */
import { ext } from '../const';

// TODO: Remove from UpdateItemScreen
export const CART_ACTION_TYPES = {
  ADD: 'ADD',
  REMOVE: 'REMOVE',
  UPDATE: 'UPDATE',
};

/**
 @typedef ABANDONED_CART_TRIGGER
 @type {object}
 */
export const ABANDONED_CART_TRIGGER = ext('abandoned-cart');

/**
 @typedef SHOP_LOADING
 @type {object}
 */
export const SHOP_LOADING = ext('SHOP_LOADING');

/**
 @typedef SHOP_LOADED
 @type {object}
 @property payload {collections: [], currency: string, tags: []} Data
 */
export const SHOP_LOADED = ext('SHOP_LOADED');

/**
 @typedef SHOP_ERROR_LOADING
 @type {object}
 */
export const SHOP_ERROR_LOADING = ext('SHOP_ERROR_LOADING');

/**
 @typedef CART_ITEM_ADDED
 @type {object}
 @property payload {item: {}, variant: {}, quantity: number} Cart item
 */
export const CART_ITEM_ADDED = ext('CART_ITEM_ADDED');

/**
 @typedef CART_ITEM_REMOVED
 @type {object}
 @property payload {item: {}, variant: {}, quantity: number} Cart item
 */
export const CART_ITEM_REMOVED = ext('CART_ITEM_REMOVED');

/**
 @typedef CART_ITEM_UPDATED
 @type {object}
 @property payload {item: {}, variant: {}, quantity: number} Cart item
 */
export const CART_ITEM_UPDATED = ext('CART_ITEM_UPDATED');

/**
 @typedef PRODUCTS_LOADING
 @type {object}
 @property payload { collectionId: number, tag: string } Parameters
 */
export const PRODUCTS_LOADING = ext('PRODUCTS_LOADING');

/**
 @typedef PRODUCTS_LOADED
 @type {object}
 @property payload { products: [], collectionId: number, tag: string, page: number,
   resetMode: boolean } Data
 */
export const PRODUCTS_LOADED = ext('PRODUCTS_LOADED');

/**
 @typedef PRODUCTS_ERROR
 @type {object}
 @property payload { collectionId: number, tag: string } Parameters
 */
export const PRODUCTS_ERROR = ext('PRODUCTS_ERROR');

/**
 @typedef CUSTOMER_INFORMATION_UPDATED
 @type {object}
 @property payload { customer: { email: string, firstName: string, lastName: string,
    address: string, city: string, countryCode: string, zip: string }} Customer information
 */
export const CUSTOMER_INFORMATION_UPDATED = ext('CUSTOMER_INFORMATION_UPDATED');

/**
 @typedef ORDER_NUMBER_LOADED
 @type {object}
 @property payload { orderNumber: {} } The order number
 */
export const ORDER_NUMBER_LOADED = ext('ORDER_NUMBER_LOADED');

/**
 @typedef CHECKOUT_COMPLETED
 @type {object}
 */
export const CHECKOUT_COMPLETED = ext('CHECKOUT_COMPLETED');

/**
 @typedef APP_MOUNTED
 @type {object}
 */
export const APP_MOUNTED = ext('APP_MOUNTED');

/**
 @typedef CUSTOMER_LOGIN_SUCCESS
 @type {object}
 */
export const CUSTOMER_LOGIN_SUCCESS = ext('CUSTOMER_LOGIN_SUCCESS');

/**
 @typedef CUSTOMER_ERROR
 @type {object}
 */
export const CUSTOMER_ERROR = ext('CUSTOMER_ERROR');

/**
 @typedef CUSTOMER_LOADING
 @type {object}
 */
export const CUSTOMER_LOADING = ext('CUSTOMER_LOADING');

/**
 @typedef ORDERS_LOADING
 @type {object}
 */
export const ORDERS_LOADING = ext('ORDERS_LOADING');

/**
 @typedef ORDERS_LOADED
 @type {object}
 */
export const ORDERS_LOADED = ext('ORDERS_LOADED');

/**
 @typedef SET_ORDERS_ERROR
 @type {object}
 */
export const SET_ORDERS_ERROR = ext('SET_ORDERS_ERROR');
