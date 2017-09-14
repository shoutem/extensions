import rio from '@shoutem/redux-io';
import { getExtensionSettings } from 'shoutem.application';

import {
  STATUSES_SCHEMA,
  USERS_SCHEMA,
} from './redux';

const APPLICATION_EXTENSION = 'shoutem.application';

export const apiVersion = '59';

let endPoint = null;

export function getApiEndpoint() {
  if (!endPoint) {
    console.log('Api endpoint is not defined yet.');
  }
  return endPoint;
}

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const apiEndpoint = getExtensionSettings(state, APPLICATION_EXTENSION).legacyApiEndpoint;
  endPoint = apiEndpoint;

  const apiRequestOptions = {
    resourceType: 'JSON',
    headers: {
      'Content-Type': 'application/json',
    },
  };

  rio.registerSchema({
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: '',
      ...apiRequestOptions,
    },
  });

  rio.registerSchema({
    schema: USERS_SCHEMA,
    request: {
      endpoint: '',
      ...apiRequestOptions,
    },
  });
}
