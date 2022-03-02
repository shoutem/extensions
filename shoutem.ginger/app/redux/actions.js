import _ from 'lodash';
import { RSAA } from 'redux-api-middleware';
import { createSelector } from 'reselect';
import { getExtensionSettings } from 'shoutem.application';
import {
  getAccessToken,
  getErrorCode,
  getErrorMessage,
  getUser,
  hideShortcuts,
  login,
  register,
  saveSession,
  userAuthenticatedLimited,
  userLoggedIn,
  userRegistered,
} from 'shoutem.auth';
import { navigateTo } from 'shoutem.navigation';
import { updateProfile } from 'shoutem.user-profile';
import { ext } from '../const';
import { asPromise, handleGingerError } from '../services';
import {
  CANCEL_ORDER_ACTION_TYPES,
  CREATE_CUSTOMER_ACTION_TYPES,
  CREATE_ORDER_ACTION_TYPES,
  INVENTORY_ACTION_TYPES,
  LOAD_CART_ACTION_TYPES,
  LOAD_DELIVERY_TIMES_ACTION_TYPES,
  LOAD_ORDERS_ACTION_TYPES,
  REFRESH_CART_ACTION_TYPES,
  SEND_OTP_ACTION_TYPES,
  UPDATE_ORDER_ACTION_TYPES,
  VERIFY_OTP_ACTION_TYPES,
} from './const';
import {
  getCart,
  getCompactCartProducts,
  getCustomerPlaceId,
  getCustomerProfile,
  getGingerCustomer,
} from './selectors';

const API_HOST = 'https://api.gngr.io/api';

const getApiKey = createSelector(
  [state => getExtensionSettings(state, ext())],
  settings => settings.storeApiKey,
);

export const SET_CUSTOMER_PROFILE = 'SET_CUSTOMER_PROFILE';
export const SET_VERIFICATION_COMPLETED = 'SET_VERIFICATION_COMPLETED';
export const SET_LOGIN_SCREEN_SHOWN = 'SET_LOGIN_SCREEN_SHOWN';

export function setCustomerProfile(payload) {
  return {
    type: SET_CUSTOMER_PROFILE,
    payload,
  };
}

export function setVerificationCompleted(payload) {
  return {
    type: SET_VERIFICATION_COMPLETED,
    payload,
  };
}

export function setLoginScreenShown() {
  return {
    type: SET_LOGIN_SCREEN_SHOWN,
  };
}

export function loginUser(username, password, onLoginSuccess) {
  return async (dispatch, getState) => {
    try {
      await dispatch(login(username, password));

      const state = getState();
      const user = getUser(state);
      const settings = getExtensionSettings(state, ext());
      // eslint-disable-next-line camelcase
      const access_token = getAccessToken(state);

      if (settings.manuallyApproveMembers && !user.approved) {
        return dispatch(userAuthenticatedLimited());
      }

      await dispatch(loadCart());
      await dispatch(loadInventory());

      return dispatch(
        userLoggedIn({
          user,
          access_token,
          callback: onLoginSuccess,
        }),
      ).then(() => {
        saveSession(JSON.stringify({ access_token }));
        dispatch(hideShortcuts(user));
      });
    } catch (e) {
      const code = _.get(e, 'payload.response.errors[0].code', null);

      if (code) {
        const errorCode = getErrorCode(code);
        const errorMessage = getErrorMessage(errorCode);

        throw errorMessage;
      }
    }
  };
}

export function registerUser(customer, onRegisterSuccess) {
  return async (dispatch, getState) => {
    try {
      const {
        email,
        nick,
        password,
        address,
        googlePlaceId,
        location,
      } = getCustomerProfile(getState());

      const {
        payload: { data: user },
      } = await dispatch(register(email, nick, password));

      const createdUser = {
        id: user?.id,
        userGroups: user?.relationships?.userGroups?.data,
        ...user?.attributes,
      };

      const addresses = [{ googlePlaceId, address, location }];
      const defaultAddress = 0;

      await dispatch(
        updateCustomerInfo({ ...customer, nick, addresses, defaultAddress }),
      );

      // eslint-disable-next-line camelcase
      const access_token = getAccessToken(getState());

      if (!createdUser.approved) {
        const callback = () => navigateTo(ext('LoginScreen'));

        return dispatch(userAuthenticatedLimited(callback));
      }

      await dispatch(loadCart());
      await dispatch(loadInventory());

      await dispatch(
        userRegistered({
          user: createdUser,
          access_token,
          callback: onRegisterSuccess,
        }),
      );

      saveSession(JSON.stringify({ access_token }));
      return dispatch(hideShortcuts(createdUser));
    } catch (e) {
      const code = _.get(e, 'payload.response.errors[0].code', null);

      if (code) {
        const errorCode = getErrorCode(code);
        const errorMessage = getErrorMessage(errorCode);

        throw errorMessage;
      }
    }
  };
}

export function sendVerificationCode(phone) {
  return async (dispatch, getState) => {
    const state = getState();

    try {
      await asPromise(() =>
        dispatch({
          [RSAA]: {
            endpoint: `${API_HOST}/customers/otp-request`,
            method: 'POST',
            headers: {
              Accept: 'application/json',
              'Content-type': 'application/json',
              authorization: getApiKey(state),
            },
            body: JSON.stringify({
              phone,
            }),
            types: SEND_OTP_ACTION_TYPES,
          },
        }),
      );
    } catch (e) {
      const errorMessage = handleGingerError(e);

      if (errorMessage) {
        throw errorMessage;
      }
    }
  };
}

export function verifyCode(phone, code) {
  return (dispatch, getState) => {
    const state = getState();

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/customers/otp-verify`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            authorization: getApiKey(state),
          },
          body: JSON.stringify({
            phone,
            otp: code,
          }),
          types: VERIFY_OTP_ACTION_TYPES,
        },
      }),
    );
  };
}

export function createCustomer() {
  return (dispatch, getState) => {
    const state = getState();
    const { phoneNumber, firstName, lastName, email, dob } = getCustomerProfile(
      state,
    );

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/customers`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            authorization: getApiKey(state),
          },
          body: JSON.stringify({
            phone: phoneNumber,
            firstName,
            lastName,
            email,
            dob,
          }),
          types: CREATE_CUSTOMER_ACTION_TYPES,
        },
      }),
    );
  };
}

export function completeUserVerification(phoneNumber, code) {
  return async dispatch => {
    try {
      await dispatch(verifyCode(phoneNumber, code));
    } catch (e) {
      const errorMessage = handleGingerError(e);

      if (errorMessage) {
        throw errorMessage;
      }
    }

    try {
      const response = await dispatch(createCustomer());

      return response;
    } catch (e) {
      const errorMessage = handleGingerError(e);

      if (errorMessage) {
        throw errorMessage;
      }
    }
  };
}

export function loadInventory() {
  return (dispatch, getState) => {
    const state = getState();
    const googlePlaceId = getCustomerPlaceId(state);

    asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/inventory?googlePlaceId=${googlePlaceId}`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: getApiKey(state),
          },
          types: INVENTORY_ACTION_TYPES,
        },
      }),
    );
  };
}

export function loadDeliveryTimes() {
  return (dispatch, getState) => {
    const state = getState();
    const googlePlaceId = getCustomerPlaceId(state);

    asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/delivery-schedule?googlePlaceId=${googlePlaceId}`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: getApiKey(state),
          },
          types: LOAD_DELIVERY_TIMES_ACTION_TYPES,
        },
      }),
    );
  };
}

export function loadCart() {
  return (dispatch, getState) => {
    const state = getState();
    const customerId = getGingerCustomer(state).id;

    asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart?customerId=${customerId}`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: getApiKey(state),
          },
          types: LOAD_CART_ACTION_TYPES,
        },
      }),
    );
  };
}

export function loadOrders() {
  return (dispatch, getState) => {
    const state = getState();
    const customerId = getGingerCustomer(state).id;

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/orders?customerId=${customerId}&limit=100&offset=0`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: getApiKey(state),
          },
          types: LOAD_ORDERS_ACTION_TYPES,
        },
      }),
    );
  };
}

export function updateOrderInformation(note) {
  return (dispatch, getState) => {
    const state = getState();
    const orderId = getCart(state).id;

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart/note`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: getApiKey(state),
          },
          body: JSON.stringify({
            orderId,
            note,
          }),
          types: UPDATE_ORDER_ACTION_TYPES,
        },
      }),
    );
  };
}

export function createOrder(timeslotInfo) {
  return (dispatch, getState) => {
    const state = getState();
    const orderId = getCart(state).id;

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart/checkout`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: getApiKey(state),
          },
          body: JSON.stringify({
            orderId,
            timeslotInfo,
          }),
          types: CREATE_ORDER_ACTION_TYPES,
        },
      }),
    );
  };
}

export function cancelOrder(orderId, reason) {
  return (dispatch, getState) => {
    const state = getState();

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/orders?order_id=${orderId}&reason=${reason}`,
          method: 'DELETE',
          headers: {
            Accept: 'application/json',
            Authorization: getApiKey(state),
          },
          types: CANCEL_ORDER_ACTION_TYPES,
        },
      }),
    ).then(() => dispatch(loadOrders()));
  };
}

export function completeCheckout(timeslotInfo, additionalInfo) {
  return dispatch => {
    if (additionalInfo) {
      return dispatch(updateOrderInformation(additionalInfo)).then(() =>
        dispatch(createOrder(timeslotInfo)).then(() => dispatch(loadOrders())),
      );
    }

    return dispatch(createOrder(timeslotInfo)).then(() =>
      dispatch(loadOrders()),
    );
  };
}

export function addToCart(skuId, quantity) {
  return (dispatch, getState) => {
    const state = getState();
    const customerId = getGingerCustomer(state).id;
    const googlePlaceId = getCustomerPlaceId(state);
    const currentProducts = getCompactCartProducts(state);
    const cart = getCart(state);

    const vouchers = _.get(cart, 'vouchers');

    const matchingProduct = _.find(currentProducts, { skuId });
    const newProduct = matchingProduct
      ? { skuId, quantity: matchingProduct.quantity + quantity }
      : {
          skuId,
          quantity,
        };
    const newCart = matchingProduct
      ? [
          ..._.filter(currentProducts, product => product.skuId !== skuId),
          newProduct,
        ]
      : [...currentProducts, newProduct];

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart?customerId=${customerId}`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: getApiKey(state),
          },
          body: JSON.stringify({
            customerId,
            googlePlaceId,
            skus: newCart,
            ...(vouchers && { vouchers }),
          }),
          types: LOAD_CART_ACTION_TYPES,
        },
      }),
    );
  };
}

export function removeFromCart(skuId) {
  return (dispatch, getState) => {
    const state = getState();
    const customerId = getGingerCustomer(state).id;
    const googlePlaceId = getCustomerPlaceId(state);
    const currentProducts = getCompactCartProducts(state);
    const cart = getCart(state);

    const vouchers = _.get(cart, 'vouchers');

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart?customerId=${customerId}`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: getApiKey(state),
          },
          body: JSON.stringify({
            customerId,
            googlePlaceId,
            skus: _.filter(currentProducts, product => product.skuId !== skuId),
            ...(vouchers && { vouchers }),
          }),
          types: LOAD_CART_ACTION_TYPES,
        },
      }),
    );
  };
}

export function applyPromoCode(code) {
  return (dispatch, getState) => {
    const state = getState();
    const customerId = getGingerCustomer(state).id;
    const googlePlaceId = getCustomerPlaceId(state);
    const currentProducts = getCompactCartProducts(state);

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart?customerId=${customerId}`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: getApiKey(state),
          },
          body: JSON.stringify({
            customerId,
            googlePlaceId,
            skus: currentProducts,
            vouchers: [code],
          }),
          types: LOAD_CART_ACTION_TYPES,
        },
      }),
    );
  };
}

export function refreshCart() {
  return (dispatch, getState) => {
    const state = getState();
    const customerId = getGingerCustomer(state).id;

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart/refresh?customerId=${customerId}`,
          method: 'GET',
          headers: {
            Accept: 'application/json',
            Authorization: getApiKey(state),
          },
          types: REFRESH_CART_ACTION_TYPES,
        },
      }),
    );
  };
}

export function clearCart() {
  return (dispatch, getState) => {
    const state = getState();
    const customerId = getGingerCustomer(state).id;
    const googlePlaceId = getCustomerPlaceId(state);

    return asPromise(() =>
      dispatch({
        [RSAA]: {
          endpoint: `${API_HOST}/cart?customerId=${customerId}`,
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-type': 'application/json',
            Authorization: getApiKey(state),
          },
          body: JSON.stringify({
            customerId,
            googlePlaceId,
            skus: [],
          }),
          types: LOAD_CART_ACTION_TYPES,
        },
      }),
    );
  };
}

export function resetCart() {
  return dispatch => dispatch(refreshCart()).then(() => dispatch(clearCart()));
}

const PROFILE_FIELDS = [
  'firstName',
  'lastName',
  'phone',
  'image',
  'birthday',
  'nick',
];
const GINGER_PROFILE_OMIT_FIELDS = ['image', 'birthday', 'nick'];

export function updateCustomerInfo(updates) {
  return (dispatch, getState) => {
    const state = getState();
    const customer = getGingerCustomer(state);

    const profileFields = _.pick(updates, PROFILE_FIELDS);
    const updatedCustomer = _.omit(updates, GINGER_PROFILE_OMIT_FIELDS);

    return dispatch(
      updateProfile({
        ...profileFields,
        [ext()]: { ...customer, ...updatedCustomer },
      }),
    );
  };
}
