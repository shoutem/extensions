import { ext } from 'src/const';
import { shoutemUrls } from 'src/services';
import { find } from '@shoutem/redux-io';
import { CATEGORIES } from '../const';

export function loadAppCategories(appId) {
  const params = {
    q: {
      'page[limit]': 10000,
    },
  };

  const config = {
    schema: CATEGORIES,
    request: {
      endpoint: shoutemUrls.legacyApi(`/v1/apps/${appId}/categories{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('app-categories'), params);
}
