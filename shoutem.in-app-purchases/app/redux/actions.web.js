import { ext } from '../const';

export const PRODUCTS_LOADED_ACTION = `${ext()}.PRODUCTS_LOADED`;
export const ACTIVE_PRODUCTS_LOADED_ACTION = `${ext()}.ACTIVE_PRODUCTS_LOADED`;
export const SET_MOCKED_SUBSCRIPTION_ACTION = `${ext()}.SET_MOCKED_SUBSCRIPTION`;

export function loadAvailableProducts() {
  return dispatch =>
    dispatch({
      type: PRODUCTS_LOADED_ACTION,
      payload: [],
    });
}

export function loadActiveProducts() {
  return dispatch =>
    dispatch({
      type: ACTIVE_PRODUCTS_LOADED_ACTION,
      payload: [],
    });
}

export function loadProducts() {
  return dispatch => {
    return Promise.all([
      dispatch(loadAvailableProducts()),
      dispatch(loadActiveProducts()),
    ]);
  };
}

export function setMockedSubscriptionStatus(status) {
  return {
    type: SET_MOCKED_SUBSCRIPTION_ACTION,
    payload: status,
  };
}

export function buyProduct() {
  return dispatch => dispatch(loadProducts());
}

export function restorePurchases() {
  return dispatch => dispatch(loadProducts());
}

export default {
  loadActiveProducts,
  loadAvailableProducts,
  buyProduct,
  loadProducts,
  restorePurchases,
  setMockedSubscriptionStatus,
};
