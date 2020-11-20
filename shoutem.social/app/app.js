import URI from 'urijs';

import rio from '@shoutem/redux-io';

import { getAppId } from 'shoutem.application/app';
import { getExtensionSettings } from 'shoutem.application/redux';
import { USER_SCHEMA } from 'shoutem.auth';
import { shoutemApi } from './services/shoutemApi';

import { ext, STATUSES_SCHEMA } from './const';

const APPLICATION_EXTENSION = 'shoutem.application';
const AUTH_EXTENSION = 'shoutem.auth';

export const apiVersion = '59';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const apiEndpoint = getExtensionSettings(state, APPLICATION_EXTENSION).legacyApiEndpoint;

  const { authApiEndpoint } = getExtensionSettings(state, AUTH_EXTENSION);
  if (!authApiEndpoint) {
    console.error(`Authentication API endpoint not set in ${ext()} settings.`);
  }

  const appId = getAppId();
  shoutemApi.init(apiEndpoint, authApiEndpoint, appId);

  const apiRequestOptions = {
    resourceType: 'JSON',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  const jsonApiRequestOptions = {
    headers: {
      'Accept': 'application/vnd.api+json',
    },
  };

  rio.registerResource({
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: '',
      ...apiRequestOptions,
    },
  });
}
