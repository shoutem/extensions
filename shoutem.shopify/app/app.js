import { AppState } from 'react-native';
import _ from 'lodash';
import { registerIcons } from '@shoutem/ui';
import { Platform } from 'react-native';
import { getExtensionSettings } from 'shoutem.application';
import { cancelPendingJourney } from 'shoutem.notification-center';
import {
  appMounted,
  refreshProducts,
  shopErrorLoading,
  shopLoaded,
  shopLoading,
  triggerAbandonedCart,
} from './redux/actionCreators';
import { initShopifyClient } from './services/shopifyClient';
import { images } from './assets';
import { ext } from './const';
import MBBridge from './MBBridge';
import { ABANDONED_CART_TRIGGER, actions } from './redux';

const createHandleAppStateChange = dispatch => appState => {
  if (appState.match(/inactive|background/)) {
    dispatch(triggerAbandonedCart());
  }

  if (appState === 'active') {
    dispatch(cancelPendingJourney(ABANDONED_CART_TRIGGER));
  }
};

let appStateListener;
let handleAppStateChange;

/* eslint-disable consistent-return */
export async function appDidMount(app) {
  const store = app.getStore();
  const { dispatch } = store;
  const state = store.getState();

  const iconConfig = [
    {
      name: 'shopify-order-receipt',
      icon: images.receipt,
    },
    {
      name: 'shopify-order-date',
      icon: images.orderDate,
    },
    {
      name: 'shopify-order-status',
      icon: images.orderStatus,
    },
  ];

  registerIcons(iconConfig);

  const { store: shopifyStore, apiKey } = getExtensionSettings(state, ext());

  if (!shopifyStore || !apiKey) {
    return dispatch(shopErrorLoading());
  }

  dispatch(appMounted());

  MBBridge.initStore(shopifyStore, apiKey);
  initShopifyClient(shopifyStore, apiKey);

  // Log in disabled on Android
  if (Platform.OS === 'ios') {
    MBBridge.isLoggedIn()
    .then(isLoggedIn => {
      if (isLoggedIn) {
        dispatch(actions.getCustomer());
      }
    })
    .catch(error =>
      console.error('Error while checking Shopify isLoggedIn:', error),
    );
  }

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
      appStateListener = AppState.addEventListener(
        'change',
        handleAppStateChange,
      );
    })
    .catch(() => {
      dispatch(shopErrorLoading());
    });
}

export function appWillUnmount() {
  appStateListener.remove();
}
