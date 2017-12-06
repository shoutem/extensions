import { combineReducers } from 'redux';
import _ from 'lodash';
import {
  find,
  update,
  getOne,
  storage,
  one,
} from '@shoutem/redux-io';
import { shoutemUrls } from 'src/services';
import ext from 'src/const';
import { moduleName, APPLICATION_SETTINGS } from './const';

// SELECTORS
function getGeneralSettingsState(state) {
  return state[ext()][moduleName];
}
export function getAppSettings(state) {
  const appSettings = _.get(getGeneralSettingsState(state), 'appSettings');
  return getOne(appSettings, state);
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

// REDUCER
export const reducer = combineReducers({
  storage: storage(APPLICATION_SETTINGS),
  appSettings: one(APPLICATION_SETTINGS, ext('appSettings')),
});
