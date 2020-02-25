import { getExtensionSettings } from 'shoutem.application';
import Client from 'shopify-buy';
import gql from 'graphql-tag';
import axios from 'axios';

import { ApolloClient } from 'apollo-client';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { InMemoryCache } from 'apollo-cache-inmemory';

import {
  refreshProducts,
  shopLoading,
  shopLoaded,
  shopErrorLoading,
  appMounted,
} from './redux/actionCreators';
import { ext } from './const';
import MBBridge from './MBBridge';

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

  dispatch(shopLoading());
  Promise.all([MBBridge.getCollections(), MBBridge.getShop()])
  .then(([collections, shop]) => {
    shop.collections = collections;
    shop.currency = shop.moneyFormat.replace('{{amount}}', '').replace(/<\/?[^>]+(>|$)/g, '').trim()
    dispatch(shopLoaded(collections, shop, []));
    // TODO: Figure out why only the first item of a collection is refreshed
    dispatch(refreshProducts(collections[0].id));
  })
  .catch(() => {
    dispatch(shopErrorLoading());
  });
}
