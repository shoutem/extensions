import { getExtensionSettings } from 'shoutem.application';
import {
  refreshProducts,
  shopLoading,
  shopLoaded,
  shopErrorLoading,
  appMounted,
} from './redux/actionCreators';
import Client from 'shopify-buy';
import { ext } from './const';
import MBBridge from './MBBridge';

let ShopifyClient = null;

/* eslint-disable consistent-return */
export function appDidMount(app) {
  const store = app.getStore();
  const { dispatch } = store;
  const state = store.getState();

  const { store: shopifyStore, apiKey } = getExtensionSettings(state, ext());

  if (!(shopifyStore && apiKey)) {
    return dispatch(shopErrorLoading());
  }

  dispatch(appMounted());

  MBBridge.initStore(shopifyStore, apiKey);
  ShopifyClient = Client.buildClient({
    domain: shopifyStore,
    storefrontAccessToken: apiKey,
  });

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
    })
    .catch(() => {
      dispatch(shopErrorLoading());
    });
}

export { ShopifyClient };
