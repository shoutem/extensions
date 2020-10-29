import { combineReducers } from 'redux';
import _ from 'lodash';
import { find, update, getOne, storage, one } from '@shoutem/redux-io';
import { shoutemUrls } from 'src/services';
import ext from 'src/const';
import {
  moduleName,
  APPLICATION_SETTINGS,
  APPLICATION_STORE_SETTINGS,
  AUTH_REALMS,
} from './const';

// SELECTORS
function getGeneralSettingsState(state) {
  return state[ext()][moduleName];
}
export function getAppSettings(state) {
  const appSettings = _.get(getGeneralSettingsState(state), 'appSettings');
  return getOne(appSettings, state);
}
export function getAppStoreSettings(state) {
  const storeSettings = _.get(getGeneralSettingsState(state), 'storeSettings');
  return getOne(storeSettings, state);
}

// ACTIONS
export function loadAppSettings(appId, scope = {}) {
  const config = {
    schema: APPLICATION_SETTINGS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/legacy-settings`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('appSettings'), scope);
}

export function loadAppStoreSettings(appId, scope = {}) {
  const config = {
    schema: APPLICATION_STORE_SETTINGS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(
        `/v1/apps/${appId}/legacy-store-settings`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('storeSettings'), scope);
}

export function updateAppSettings(appId, appSettings, scope) {
  const config = {
    schema: APPLICATION_SETTINGS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/legacy-settings`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const updatedSettings = {
    type: APPLICATION_SETTINGS,
    id: appId,
    attributes: appSettings,
  };

  return update(config, updatedSettings, scope);
}

export function updateAppRealm(appId, realmPatch) {
  const config = {
    schema: AUTH_REALMS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const updatedAppRealm = {
    type: AUTH_REALMS,
    id: appId,
    attributes: realmPatch
  };

  return update(config, updatedAppRealm);
}

// REDUCER
export const reducer = combineReducers({
  storage: storage(APPLICATION_SETTINGS),
  appSettings: one(APPLICATION_SETTINGS, ext('appSettings')),
  storeStorage: storage(APPLICATION_STORE_SETTINGS),
  storeSettings: one(APPLICATION_STORE_SETTINGS, ext('storeSettings')),
});
