import Iaphub from 'react-native-iaphub';
import { ext } from '../const';

export const PRODUCTS_LOADED_ACTION = `${ext()}.PRODUCTS_LOADED`;
export const ACTIVE_PRODUCTS_LOADED_ACTION = `${ext()}.ACTIVE_PRODUCTS_LOADED`;
export const SET_MOCKED_SUBSCRIPTION_ACTION = `${ext()}.SET_MOCKED_SUBSCRIPTION`;

export function loadAvailableProducts() {
  return dispatch =>
    Iaphub.getProductsForSale().then(products => {
      dispatch({
        type: PRODUCTS_LOADED_ACTION,
        payload: products,
      });
    });
}

export function loadActiveProducts() {
  return dispatch =>
    Iaphub.getActiveProducts().then(products => {
      dispatch({
        type: ACTIVE_PRODUCTS_LOADED_ACTION,
        payload: products,
      });
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

export function buyProduct(productId) {
  return dispatch => Iaphub.buy(productId).then(() => dispatch(loadProducts()));
}

export function restorePurchases() {
  return dispatch => Iaphub.restore().then(() => dispatch(loadProducts()));
}

export default {
  loadActiveProducts,
  loadAvailableProducts,
  buyProduct,
  loadProducts,
  restorePurchases,
  setMockedSubscriptionStatus,
};
