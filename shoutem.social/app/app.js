import rio from '@shoutem/redux-io';
import { getExtensionSettings } from 'shoutem.application';
import { shoutemApi } from './services';

import {
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

  const apiRequestOptions = {
    resourceType: 'JSON',
    headers: {
      'Content-Type': 'application/json',
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
      endpoint: '',
      ...apiRequestOptions,
    },
  });
}
