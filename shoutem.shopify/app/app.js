import { AppState } from 'react-native';
import { getExtensionSettings } from 'shoutem.application';
import { cancelPendingJourney } from 'shoutem.notification-center';
import {
  appMounted,
  fetchStorefrontToken,
  refreshProducts,
  shopErrorLoading,
  shopLoaded,
  shopLoading,
  triggerAbandonedCart,
} from './redux/actionCreators';
import { initShopifyClient } from './services/shopifyClient';
import { ext } from './const';
import MBBridge from './MBBridge';
import { ABANDONED_CART_TRIGGER } from './redux';

const createHandleAppStateChange = dispatch => appState => {
  if (appState.match(/inactive|background/)) {
    dispatch(triggerAbandonedCart());
  }

  if (appState === 'active') {
    dispatch(cancelPendingJourney(ABANDONED_CART_TRIGGER));
  }
};

let handleAppStateChange;

/* eslint-disable consistent-return */
export async function appDidMount(app) {
  const store = app.getStore();
  const { dispatch } = store;
  const state = store.getState();

  const { store: shopifyStore } = getExtensionSettings(state, ext());

  if (!shopifyStore) {
    return dispatch(shopErrorLoading());
  }

  const apiKey = await dispatch(fetchStorefrontToken(shopifyStore));

  if (!apiKey) {
    return dispatch(shopErrorLoading());
  }

  dispatch(appMounted());

  MBBridge.initStore(shopifyStore, apiKey);
  initShopifyClient(shopifyStore, apiKey);

  dispatch(shopLoading());
  Promise.all([MBBridge.getCollections(), MBBridge.getShop()])
    .then(([collections, shop]) => {
      shop.collections = collections;
      shop.currency = shop.moneyFormat
        .replace('{{amount}}', '')
        .replace(/<\/?[^>]+(>|$)/g, '')
        .trim();
      dispatch(shopLoaded(collections, shop, []));
      // TODO: Figure out why only the first item of a collection is refreshed
      dispatch(refreshProducts(collections[0].id));

      handleAppStateChange = createHandleAppStateChange(dispatch);
      AppState.addEventListener('change', handleAppStateChange);
    })
    .catch(() => {
      dispatch(shopErrorLoading());
    });
}
