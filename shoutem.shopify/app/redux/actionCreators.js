import _ from 'lodash';
import { Alert } from 'react-native';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { ShopifyClient } from '../app';
import { ext } from '../const';
import MBBridge from '../MBBridge';
import {
  SHOP_LOADING,
  SHOP_LOADED,
  SHOP_ERROR_LOADING,
  CART_ITEM_ADDED,
  CART_ITEM_REMOVED,
  CART_ITEM_UPDATED,
  PRODUCTS_ERROR,
  PRODUCTS_LOADING,
  PRODUCTS_LOADED,
  CUSTOMER_INFORMATION_UPDATED,
  ORDER_NUMBER_LOADED,
  CHECKOUT_COMPLETED,
  APP_MOUNTED,
} from './actionTypes';
import { getDiscountCode } from './selectors';

/**
 * @see SHOP_LOADING
 * Used to notify that shop information is being loaded
 * @returns {{ type: String }}
 */
export function shopLoading() {
  return {
    type: SHOP_LOADING,
  };
}

/**
 * @see SHOP_LOADED
 * Used for setting shop information
 * @param collections - Collections from Shopify, used to group products
 * @param shop - Basic shop information such as currency
 * @param tags - Shopify product tags, used to filter them
 * @returns {{ type: String, payload: { collections: [], currency: String, tags: [] }}}
 */
export function shopLoaded(collections, shop, tags) {
  return {
    type: SHOP_LOADED,
    payload: {
      collections,
      ...shop,
      tags,
    },
  };
}

/**
 * @see SHOP_ERROR_LOADING
 * Used to notify that shop information couldn't be loaded
 * @returns {{ type: String }}
 */
export function shopErrorLoading() {
  return {
    type: SHOP_ERROR_LOADING,
  };
}

/**
 * @see CART_ITEM_ADDED
 * Used for adding an item to the cart
 * @param cartItem - New item
 * @returns {{ type: String, payload: { cartItem: {} } }}
 */
export function cartItemAdded(cartItem) {
  return {
    type: CART_ITEM_ADDED,
    payload: cartItem,
  };
}

/**
 * @see CART_ITEM_REMOVED
 * Used for removing an item from the cart
 * @param cartItem - Item to remove
 * @returns {{ type: String, payload: { cartItem: {} }}}
 */
export function cartItemRemoved(cartItem) {
  return {
    type: CART_ITEM_REMOVED,
    payload: cartItem,
  };
}

/**
 * @see CART_ITEM_UPDATED
 * Used for updating an item already in the cart
 * @param cartItem - Item to update
 * @param variant - New variant
 * @param quantity - New quantity
 * @returns {{ type: String, payload: { cartItem: {}, variant: {}, quantity: {} } }}
 */
export function cartItemUpdated(cartItem, variant, quantity) {
  return {
    type: CART_ITEM_UPDATED,
    payload: {
      cartItem,
      variant,
      quantity,
    },
  };
}

/**
 * @see PRODUCTS_LOADING
 * Used to notify that new products are being loaded
 * @param collectionId - ID of the collection for which products are loading
 * @param tag - Tag for which products are loading
 * @returns {{ type: String, payload: { collectionId: number, tag: string } }}
 */
export function productsLoading(collectionId, tag) {
  return {
    type: PRODUCTS_LOADING,
    payload: {
      collectionId,
      tag,
    },
  };
}

/**
 * @see PRODUCTS_ERROR
 * Used to notify that products couldn't be loaded
 * @param collectionId - ID of the collection used to fetch products
 * @param tag - Tag used to fetch products
 * @returns {{ type: String, payload: { collectionId: number, tag: string } }}
 */
export function productsError(collectionId, tag) {
  return {
    type: PRODUCTS_ERROR,
    payload: {
      collectionId,
      tag,
    },
  };
}

/**
 * @see PRODUCTS_LOADED
 * Used to notify that new products have been loaded
 * @param products - Products from Shopify
 * @param collectionId - ID of the collection these products belong to
 * @param tag - Tag associated with these products
 * @param page - Page to which results belong on Shopify
 * @param resetMode - If true, new products should replace existing ones, and otherwise
 *  they are added at the end
 * @returns {{ type: String, payload: { products: [], collectionId: number, tag: string,
 *   page: number, resetMode: boolean }}}
 */
export function productsLoaded(products, collectionId, tag, page, resetMode) {
  return {
    type: PRODUCTS_LOADED,
    payload: {
      products,
      collectionId,
      tag,
      page,
      resetMode,
    },
  };
}

/**
 * Used to fetch new products based on selected collection and tag
 * @param collectionId - ID of the collection for which to refresh products
 * @param tag - Tag used for filtering
 * @param resetMode - If true, new products should replace existing ones, and otherwise
 * they are added at the end
 * @returns {{ type: function }}
 */
export function refreshProducts(collectionId, tag, resetMode) {
  return (dispatch, getState) => {
    dispatch(productsLoading(collectionId, tag));

    // We get the last loaded page from Shopify, which is 0 if we don't have any products
    // for this combination of tag and collection
    // const { page = 0 } = getProducts(getState(), collectionId, tag);
    // const nextPage = resetMode ? 1 : page + 1;

    if (tag) {
      return MBBridge.filterProducts(tag)
        .then(res => {
          dispatch(productsLoaded(res, collectionId, tag, 0, resetMode));
        })
        .catch(error => {
          dispatch(productsError(collectionId, tag));
        });
    }

    /* Shopify.getProducts(nextPage, collectionId, tag && [tag]) */
    return MBBridge.getProductsForCollection(collectionId)
      .then(res => {
        // If we got less products than the page size, we need to ask for the same page next time
        // to get recently added products
        // const lastLoadedPage = _.size(products) < PAGE_SIZE ? nextPage - 1 : nextPage;
        dispatch(productsLoaded(res, collectionId, tag, 0, resetMode));
      })
      .catch(error => {
        dispatch(productsError(collectionId, tag));
      });
  };
}

/**
 * Used to update customer information and proceed to the next checkout step
 * @param customer - Email and address information
 * @returns {{ type: String, payload: { customer: {} }}
 */
export function updateCustomerInformation(customer, cart) {
  return async (dispatch, getState) => {
    const errorHandler = error => {
      Alert.alert(
        I18n.t(ext('checkoutErrorTitle')),
        _.map(JSON.parse(error.message), 'message').join('\n'),
      );
    };

    const state = getState();
    const discountCode = getDiscountCode(state);

    try {
      const resp = await MBBridge.createCheckoutWithCartAndClientInfo(
        cart,
        customer,
      );

      if (!_.get(resp, 'checkoutCreate.checkout')) {
        resp.checkoutCreate.checkout = {};
      }

      if (!_.get(resp, 'checkoutCreate.checkout.availableShippingRates')) {
        resp.checkoutCreate.checkout.availableShippingRates = {};
      }

      if (!_.isEmpty(discountCode)) {
        await ShopifyClient.checkout.addDiscount(
          _.get(resp, 'checkoutCreate.checkout.id'),
          discountCode,
        );
      }

      const {
        checkoutCreate: {
          userErrors = [],
          checkout: {
            requiresShipping = true,
            availableShippingRates: { shippingRates = [] } = {},
            webUrl = '',
          } = {},
        } = {},
      } = resp;

      if (userErrors.length > 0) {
        const error = userErrors[0];

        return Alert.alert(I18n.t(ext('checkoutErrorTitle')), error.message);
      }

      dispatch(customerInformationUpdated(customer));

      navigateTo(ext('WebCheckoutScreen'), {
        checkoutUrl: webUrl,
      });
    } catch (e) {
      errorHandler(e);
    }
  };
}

/**
 * @see CUSTOMER_INFORMATION_UPDATED
 * Used to notify that the user has saved his email and address during checkout
 * and proceeded to the next step
 * @param customer - Customer information
 * @returns {{ type: String, payload: { customer: {} }}
 */
export function customerInformationUpdated(customer) {
  return {
    type: CUSTOMER_INFORMATION_UPDATED,
    payload: {
      customer,
    },
  };
}

export function orderNumberLoaded(orderNumber) {
  return {
    type: ORDER_NUMBER_LOADED,
    payload: orderNumber,
  };
}

/**
 * @see CHECKOUT_COMPLETED
 * Used to notify that checkout has been completed.
 * @returns {{ type: String }}
 */
export function checkoutCompleted() {
  return {
    type: CHECKOUT_COMPLETED,
  };
}

/**
 * @see APP_MOUNTED
 * Used to notify when the app has been mounted
 * @returns {{ type: String }}
 */
export function appMounted() {
  return {
    type: APP_MOUNTED,
  };
}
