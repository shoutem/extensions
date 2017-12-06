import rio from '@shoutem/redux-io';
import { getAppId, getExtensionSettings } from 'shoutem.application';

import {
  CATEGORIES_SCHEMA,
} from './redux';

import { ext } from './const';

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  const apiEndpoint = getExtensionSettings(state, ext()).apiEndpoint;
  if (!apiEndpoint) {
    console.error(`CMS API endpoint not set in ${ext()} settings.`);
  }

  const jsonApiRequestOptions = {
    headers: {
      'Content-Type': 'application/vnd.api+json',
    },
  };

  rio.registerResource({
    schema: CATEGORIES_SCHEMA,
    request: {
      endpoint: `${apiEndpoint}/v1/apps/${appId}/categories/{?query*}`,
      ...jsonApiRequestOptions,
    },
  });

  rio.registerResource((schemaName) => ({
    schema: schemaName,
    request: {
      endpoint: `${apiEndpoint}/v1/apps/${appId}/resources/${schemaName}/{?query*}`,
      ...jsonApiRequestOptions,
    },
  }));
}
