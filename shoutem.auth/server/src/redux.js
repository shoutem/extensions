import _ from 'lodash';
import { combineReducers } from 'redux';
import { reducer as formReducer } from 'redux-form';
import { createScopedReducer } from '@shoutem/redux-api-sdk';
import {
  find,
  update,
  getOne,
  storage,
  one,
} from '@shoutem/redux-io';
import membersReducer, { moduleName as members } from './modules/members';
import { shoutemUrls } from './services';
import ext from './const';

const APPLICATION_SETTINGS = 'shoutem.core.legacy-application-settings';

// SELECTORS
function getExtensionState(state) {
  return _.get(state, ext(), {});
}

export function getFormState(state) {
  const extensionState = getExtensionState(state);
  return extensionState.form;
}

export function getAppSettings(state) {
  const extensionState = getExtensionState(state);
  return getOne(extensionState.appSettings, state);
}

// ACTIONS
export function loadApplicationSettings(appId, scope = {}) {
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

export function updateApplicationSettings(appId, appSettings, scope) {
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
export default () => (
  createScopedReducer({
    extension: {
      form: formReducer,
      [members]: membersReducer,
      appSettings: one(APPLICATION_SETTINGS, ext('appSettings')),
      storage: combineReducers({
        [APPLICATION_SETTINGS]: storage(APPLICATION_SETTINGS),
      }),
    },
  })
);
