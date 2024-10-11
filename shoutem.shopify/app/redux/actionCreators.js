import _ from 'lodash';
import { Toast } from '@shoutem/ui';
import { getAppId, getExtensionCloudUrl } from 'shoutem.application';
import { getUser, updateProfile } from 'shoutem.auth';
import { I18n } from 'shoutem.i18n';
import { navigateTo } from 'shoutem.navigation';
import { triggerCanceled, triggerOccured } from 'shoutem.notification-center';
import { isAndroid } from 'shoutem-core';
import { ext } from '../const';
import MBBridge, { SHOPIFY_ERROR_CODES } from '../MBBridge';
import { normalizeOrderPrices, PROFILE_FIELDS } from '../services';
import { ShopifyClient } from '../services/shopifyClient';
import {
  ABANDONED_CART_TRIGGER,
  APP_MOUNTED,
  CART_ITEM_ADDED,
  CART_ITEM_REMOVED,
  CART_ITEM_UPDATED,
  CHECKOUT_COMPLETED,
  CUSTOMER_ERROR,
  CUSTOMER_INFORMATION_UPDATED,
  CUSTOMER_LOADING,
  CUSTOMER_LOGIN_SUCCESS,
  ORDER_NUMBER_LOADED,
  ORDERS_LOADED,
  ORDERS_LOADING,
  PRODUCTS_ERROR,
  PRODUCTS_LOADED,
  PRODUCTS_LOADING,
  SET_ORDERS_ERROR,
  SHOP_ERROR_LOADING,
  SHOP_LOADED,
  SHOP_LOADING,
} from './actionTypes';
import {
  getCartSize,
  getCurrencyFormatting,
  getCustomerState,
  getDiscountCode,
  getOrdersPageInfo,
} from './selectors';

export function triggerAbandonedCart() {
  return (dispatch, getState) => {
    const state = getState();
    const cartSize = getCartSize(state);

    if (cartSize > 0) {
      dispatch(triggerOccured(ABANDONED_CART_TRIGGER));
    }
  };
}

export function cancelAbandonedCartTrigger() {
  return dispatch => dispatch(triggerCanceled(ABANDONED_CART_TRIGGER));
}

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
  return dispatch => {
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
        .catch(() => {
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
      .catch(() => {
        dispatch(productsError(collectionId, tag));
      });
  };
}

export function createCustomer(customer) {
  return async (dispatch, getState) => {
    try {
      const response = await MBBridge.createCustomer(customer);
      const {
        customerCreate: { customerUserErrors },
      } = response;

      if (!_.isEmpty(customerUserErrors)) {
        if (customerUserErrors?.code !== SHOPIFY_ERROR_CODES.ACTIVATE_ACCOUNT) {
          return dispatch(
            setCustomerError({
              title: I18n.t(ext('createCustomerErrorTitle')),
              message: `${I18n.t(ext('createCustomerErrorMessage'))} ${
                customerUserErrors?.message
              }`,
            }),
          );
        }

        // Registration was successful,
        // but customer has to activate account first
        Toast.showInfo({
          title: I18n.t(ext('createCustomerSuccessTitle')),
          message: customerUserErrors.message,
        });
      }

      const {
        customerCreate: { customer: createdCustomer },
      } = response;

      const currentUser = getUser(getState());

      if (createdCustomer?.id && currentUser.id) {
        dispatch(
          updateProfile({
            profile: { [ext()]: { id: createdCustomer.id } },
            id: currentUser.id,
          }),
        );
      }

      return dispatch(
        customerInformationUpdated({ customer: createdCustomer }),
      ).then(() => dispatch(login(customer.email, customer.password)));
    } catch (e) {
      return dispatch(
        setCustomerError({
          title: I18n.t(ext('createCustomerErrorTitle')),
          message: `${I18n.t(ext('createCustomerErrorMessage'))} ${e?.message}`,
        }),
      );
    }
  };
}

export function loginSuccess() {
  return {
    type: CUSTOMER_LOGIN_SUCCESS,
  };
}

export function setCustomerError(payload) {
  return {
    type: CUSTOMER_ERROR,
    payload,
  };
}

export function login(email, password) {
  return async dispatch => {
    const isLoggedIn = await MBBridge.isLoggedIn();

    if (isLoggedIn) {
      return dispatch(loginSuccess());
    }

    const response = await MBBridge.login(email, password);

    const {
      customerAccessTokenCreate: { customerUserErrors },
    } = response;

    if (!_.isEmpty(customerUserErrors)) {
      const fullErrorMessage = _.map(
        customerUserErrors,
        error => error.message,
      ).join('\n');

      // Throw error to enable .catch in login middleware
      throw new Error(fullErrorMessage);
    }

    return dispatch(loginSuccess());
  };
}

export async function refreshToken() {
  return async dispatch => {
    try {
      await MBBridge.refreshToken();

      return dispatch(loginSuccess());
    } catch (e) {
      return dispatch(
        setCustomerError({
          title: I18n.t(ext('loginError')),
          message: e?.message,
        }),
      );
    }
  };
}

/**
 * Used to update customer information and proceed to the next checkout step
 * @param customer - Email and address information
 * @returns {{ type: String, payload: { customer: {} }}}
 */
export function updateCustomerInformation(customer, cart) {
  return async (dispatch, getState) => {
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

      const {
        checkoutCreate: {
          checkoutUserErrors: createCheckoutError = [],
          checkout: { id: checkoutId, webUrl: checkoutUrl } = {},
        } = {},
      } = resp;

      if (createCheckoutError.length > 0) {
        const fullErrorMessage = _.map(
          createCheckoutError,
          error => error.message,
        ).join('\n');

        return dispatch(
          setCustomerError({
            title: I18n.t(ext('checkoutErrorTitle')),
            message: fullErrorMessage,
            displayErrorToastOnAndroid: true,
          }),
        );
      }

      let webUrl = checkoutUrl;
      let accessToken = '';

      // Android doesn't have native isLoggedIn implemented. On Android, we want to skip this
      // check and direct user to web checkout straight away.
      // Without !isAndroid check, isLoggedIn gracefully fails and enters catch, which then
      // shows error toast and prevents web redirection.
      const isLoggedIn = await MBBridge.isLoggedIn();

      if (isLoggedIn) {
        const associateResponse = await MBBridge.associateCheckout(checkoutId);

        const {
          checkoutCustomerAssociateV2: {
            checkoutUserErrors: associateCheckoutError = [],
            checkout: associateCheckout,
          },
        } = associateResponse;

        if (associateCheckoutError.length > 0 || !associateCheckout.webUrl) {
          const fullErrorMessage = _.map(
            associateCheckoutError,
            error => error.message,
          ).join('\n');

          return dispatch(
            setCustomerError({
              title: I18n.t(ext('checkoutErrorTitle')),
              message: fullErrorMessage,
              displayErrorToastOnAndroid: true,
            }),
          );
        }

        const { webUrl: checkoutUrl } = associateCheckout;
        webUrl = checkoutUrl;
        accessToken = await MBBridge.getAccessToken();
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

      dispatch(customerInformationUpdated({ customer, isLoggedIn }));

      navigateTo(ext('WebCheckoutScreen'), {
        checkoutUrl: webUrl,
        accessToken,
      });
    } catch (e) {
      return dispatch(
        setCustomerError({
          title: I18n.t(ext('checkoutErrorTitle')),
          message: e?.message,
          displayErrorToastOnAndroid: true,
        }),
      );
    }
  };
}

/**
 * @see CUSTOMER_INFORMATION_UPDATED
 * Used to notify that the user has saved his email and address during checkout
 * and proceeded to the next step
 * @param customer - Customer information
 * @returns {{ type: String, payload: { customer: {} }}}
 */
export function customerInformationUpdated(payload) {
  return {
    type: CUSTOMER_INFORMATION_UPDATED,
    payload,
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

export function fetchStorefrontToken(shop) {
  return (_dispatch, getState) => {
    const state = getState();

    const cloudHost = getExtensionCloudUrl(state, ext());

    const endpoint = `${cloudHost}/v1/token?appId=${getAppId()}&shop=${shop}`;

    return fetch(endpoint)
      .then(res => res.json())
      .then(tokenData => tokenData?.access_token);
  };
}

export function setOrdersLoading(payload) {
  return {
    type: ORDERS_LOADING,
    payload,
  };
}

export function setOrders(payload) {
  return {
    type: ORDERS_LOADED,
    payload,
  };
}

export function setOrdersError(payload) {
  return {
    type: SET_ORDERS_ERROR,
    payload,
  };
}

const DEFAULT_PAGE_SIZE = 25;

export function loadOrders(pageSize = DEFAULT_PAGE_SIZE, cursor = '') {
  return async (dispatch, getState) => {
    dispatch(setOrdersLoading(true));

    try {
      const { orders, pageInfo } = await MBBridge.getOrders(pageSize, cursor);

      const currencyFormatting = getCurrencyFormatting(getState());
      const normalizedOrders = normalizeOrderPrices(orders, currencyFormatting);

      return dispatch(setOrders({ orders: normalizedOrders, pageInfo }));
    } catch (e) {
      return dispatch(
        setOrdersError({
          title: I18n.t(ext('ordersError')),
          message: e?.message,
        }),
      );
    }
  };
}

export function loadOrderByName(orderName) {
  return async (dispatch, getState) => {
    dispatch(setOrdersLoading(true));

    try {
      const order = await MBBridge.getOrderByOrderName(orderName);

      const currencyFormatting = getCurrencyFormatting(getState());
      const normalizedOrders = normalizeOrderPrices(order, currencyFormatting);

      return dispatch(setOrders({ orders: normalizedOrders }));
    } catch (e) {
      return dispatch(
        setOrdersError({
          title: I18n.t(ext('ordersError')),
          message: e?.message,
        }),
      );
    }
  };
}

export function loadNextOrders(pageSize = DEFAULT_PAGE_SIZE) {
  return async (dispatch, getState) => {
    dispatch(setOrdersLoading(true));

    const pageInfo = getOrdersPageInfo(getState());

    if (!pageInfo?.hasNextPage) {
      return dispatch(setOrdersLoading(false));
    }

    const cursor = pageInfo?.cursor;

    return dispatch(loadOrders(pageSize, cursor));
  };
}

export function setCustomerLoading(payload) {
  return {
    type: CUSTOMER_LOADING,
    payload,
  };
}

export function getCustomer(addressCursor = '') {
  return async dispatch => {
    dispatch(setCustomerLoading(true));

    try {
      const { customer, customerUserErrors } = await MBBridge.getCustomer(
        addressCursor,
      );

      if (!_.isEmpty(customerUserErrors)) {
        return dispatch(
          setCustomerError({
            title: I18n.t(ext('updateCustomerErrorTitle')),
            message: customerUserErrors.message,
          }),
        );
      }

      return dispatch(
        customerInformationUpdated({ customer, isLoggedIn: true }),
      );
    } catch (e) {
      return dispatch(
        setCustomerError({
          message: e?.message,
        }),
      );
    }
  };
}

export function updateCustomer(updates) {
  return async dispatch => {
    try {
      dispatch(setCustomerLoading(true));

      const isLoggedIn = await MBBridge.isLoggedIn();

      if (!isLoggedIn) {
        return dispatch(setCustomerLoading(false));
      }

      const updatedUser = _.pick(updates, PROFILE_FIELDS);

      const {
        customerUpdate: { customer, customerUserErrors },
      } = await MBBridge.updateCustomer(updatedUser);

      if (!_.isEmpty(customerUserErrors)) {
        return dispatch(
          setCustomerError({
            title: I18n.t(ext('updateCustomerErrorTitle')),
            message: customerUserErrors.message,
          }),
        );
      }

      return dispatch(
        customerInformationUpdated({ customer, isLoggedIn: true }),
      );
    } catch (e) {
      return dispatch(
        setCustomerError({
          message: e?.message,
        }),
      );
    }
  };
}

export function loadNextAddresses(pageSize = DEFAULT_PAGE_SIZE) {
  return async (dispatch, getState) => {
    dispatch(setCustomerLoading(true));

    const { addressesPageInfo } = getCustomerState(getState());

    if (!addressesPageInfo?.hasNextPage) {
      return dispatch(setCustomerLoading(false));
    }

    const cursor = addressesPageInfo?.cursor;

    return dispatch(getCustomer(pageSize, cursor));
  };
}

export function createCustomerAddress(addressInfo) {
  return async dispatch => {
    dispatch(setCustomerLoading(true));

    try {
      await MBBridge.createCustomerAddress(addressInfo);

      return dispatch(getCustomer());
    } catch (e) {
      return dispatch(
        setCustomerError({
          message: e?.message,
        }),
      );
    }
  };
}

export function updateDefaultCustomerAddress(addressId) {
  return async dispatch => {
    dispatch(setCustomerLoading(true));

    try {
      await MBBridge.updateCustomerDefaultAddress(addressId);

      return dispatch(getCustomer());
    } catch (e) {
      return dispatch(
        setCustomerError({
          message: e?.message,
        }),
      );
    }
  };
}

export function updateCustomerAddress(addressId = null, addressInfo) {
  return async dispatch => {
    dispatch(setCustomerLoading(true));

    if (!addressId) {
      return dispatch(createCustomerAddress(addressInfo));
    }

    try {
      await MBBridge.updateCustomerAddress(addressId, addressInfo);

      return dispatch(getCustomer());
    } catch (e) {
      return dispatch(
        setCustomerError({
          message: e?.message,
        }),
      );
    }
  };
}

export function deleteCustomerAddress(addressId) {
  return async dispatch => {
    dispatch(setCustomerLoading(true));

    try {
      await MBBridge.deleteCustomerAddress(addressId);

      return dispatch(getCustomer());
    } catch (e) {
      return dispatch(
        setCustomerError({
          message: e?.message,
        }),
      );
    }
  };
}
