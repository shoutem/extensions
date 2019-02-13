import URI from 'urijs';
import rio from '@shoutem/redux-io';
import { getAppId, getExtensionSettings } from 'shoutem.application';
import { shoutemApi } from './services';

import {
  ext,
  STATUSES_SCHEMA,
  USERS_SCHEMA,
} from './const';

const APPLICATION_EXTENSION = 'shoutem.application';

export const apiVersion = '59';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const apiEndpoint = getExtensionSettings(state, APPLICATION_EXTENSION).legacyApiEndpoint;
  shoutemApi.init(apiEndpoint);

  const { authApiEndpoint } = getExtensionSettings(state, ext());
  if (!authApiEndpoint) {
    console.error(`Authentication API endpoint not set in ${ext()} settings.`);
  }

  const appId = getAppId();
  function createAuthApiEndpoint(path, queryStringParams = '') {
    const endpoint = new URI(`${authApiEndpoint}/v1/realms/externalReference:${appId}/${path}`);

    return endpoint
      .protocol('https')
      .query(`${queryStringParams}`)
      .readable();
  }

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

  rio.registerResource({
    schema: USERS_SCHEMA,
    request: {
      endpoint: createAuthApiEndpoint('users/{userId}'),
      ...jsonApiRequestOptions,
    },
  });
}
