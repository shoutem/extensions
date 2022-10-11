import _ from 'lodash';
import { combineReducers } from 'redux';
import { resource, find } from '@shoutem/redux-io';
import { ext } from 'src/const';

// CONST
export const moduleName = 'shopify';
export const SHOPIFY_COLLECTIONS_SCHEMA = 'shoutem.shopify.collections';

// SELECTORS
export function getShopifyState(state) {
  return state[ext()][moduleName];
}

export function getShopifyCollections(state) {
  const shopifyCollections = getShopifyState(state).shopifyCollections;
  return _.get(shopifyCollections, 'collection_listings', []);
}

// ACTIONS
export function loadShopifyCollections(store, apiKey, scope, page) {
  /* eslint-disable no-undef */
  const authorization = `Basic ${btoa(apiKey)}`;

  const resolvedPage = page || 1;

  const config = {
    schema: SHOPIFY_COLLECTIONS_SCHEMA,
    request: {
      endpoint: `https://${store}/api/apps/8/collection_listings.json?limit=250&page=${resolvedPage}`,
      headers: {
        Authorization: authorization,
      },
      resourceType: 'json',
    },
  };

  return find(config, SHOPIFY_COLLECTIONS_SCHEMA, scope);
}

// We use the loadCollections action to validate the URL and key since we already defined it.
// Any action that calls Shopify would do.
export function validateShopifySettings(store, apiKey, scope) {
  return loadShopifyCollections(store, apiKey, scope);
}

// REDUCER
export default combineReducers({
  shopifyCollections: resource(SHOPIFY_COLLECTIONS_SCHEMA),
});
