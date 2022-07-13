import rio from '@shoutem/redux-io';
import { getAppId, getExtensionServiceUrl } from 'shoutem.application';
import { ext } from './const';
import { CATEGORIES_SCHEMA } from './redux';

// eslint-disable-next-line no-undef
navigator.geolocation = require('@react-native-community/geolocation');

export function appDidMount(app) {
  const store = app.getStore();
  const state = store.getState();
  const appId = getAppId();
  const apiEndpoint = getExtensionServiceUrl(state, ext(), 'cms');

  if (!apiEndpoint) {
    // eslint-disable-next-line no-console
    console.error(
      'Core service endpoints not available, could not find CMS endpoint.',
    );
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

  rio.registerResource(schemaName => ({
    schema: schemaName,
    request: {
      endpoint: `${apiEndpoint}/v1/apps/${appId}/resources/${schemaName}/{?query*}`,
      ...jsonApiRequestOptions,
    },
  }));
}
