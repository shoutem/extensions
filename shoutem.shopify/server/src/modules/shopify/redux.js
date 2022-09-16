import _ from 'lodash';
import { combineReducers } from 'redux';
import { ext } from 'src/const';
import Uri from 'urijs';
import { getExtension } from '@shoutem/redux-api-sdk';
import { find, resource } from '@shoutem/redux-io';

// CONST
export const moduleName = 'shopify';
export const SHOPIFY_COLLECTIONS_SCHEMA = 'shoutem.shopify.collections';

// fetch is kinda stupid and doesn't know how
// to throw error on simple failed requests so we wrap it here
const errorFetch = (...args) =>
  fetch(...args).then(async res => {
    if (!res.ok) {
      const error = await res.json();
      throw new Error(error);
    }

    return res.json();
  });

function composeCloudUri(state, path = '', query = {}) {
  const extensionSettings = getExtension(state, ext()).settings;

  const { services } = extensionSettings;

  const cloudUri = _.get(services, 'self.cloud');
  const fullPath = `${cloudUri}/v1${path}`;

  return new Uri(fullPath).query(query).toString();
}

// SELECTORS
export function getShopifyState(state) {
  return state[ext()][moduleName];
}

export function getShopifyCollections(state) {
  const { shopifyCollections } = getShopifyState(state);
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

export function checkShopConnection(shop) {
  return (_dispatch, getState) => {
    const state = getState();

    const endpoint = composeCloudUri(state, '/check-authorization', { shop });

    return errorFetch(endpoint);
  };
}

export function connectShop(shop) {
  return (_dispatch, getState) => {
    const state = getState();

    const endpoint = composeCloudUri(state, '/install', { shop });

    return window.open(endpoint, '_blank');
  };
}

export function getStorefrontToken(appId, shop) {
  return (_dispatch, getState) => {
    const state = getState();

    const endpoint = composeCloudUri(state, '/token', { appId, shop });

    return errorFetch(endpoint);
  };
}

export function createStorefrontToken(appId, shop) {
  return (_dispatch, getState) => {
    const state = getState();

    const endpoint = composeCloudUri(state, '/token', { appId, shop });

    return errorFetch(endpoint, { method: 'POST' });
  };
}

// REDUCER
export default combineReducers({
  shopifyCollections: resource(SHOPIFY_COLLECTIONS_SCHEMA),
});
