import { find } from '@shoutem/redux-io';
import { THEMES_SCHEMA } from '../const';
import { shoutemUrls } from '../services';

export function loadExtension(extensionId) {
  const config = {
    schema: 'shoutem.extensions',
    request: {
      endpoint: shoutemUrls.extensionApi(`v1/extensions/${extensionId}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'extension');
}

export function fetchThemes(appId) {
  const config = {
    request: {
      endpoint: shoutemUrls.appsApi(`/v1/apps/${appId}/themes`),
      headers: {
        Accept: 'application/vnd.api+json',
        Authorization: `Bearer ${shoutemUrls.getToken()}`,
      },
    },
    schema: THEMES_SCHEMA,
  };

  return find(config, 'allThemes');
}
