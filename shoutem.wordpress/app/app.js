import rio from '@shoutem/redux-io';

import { API_ENDPOINT, MEDIA_API_ENDPOINT } from './const';
import { WORDPRESS_NEWS_SCHEMA, WORDPRESS_MEDIA_SCHEMA } from './redux';

export function appDidMount() {
  rio.registerResource({
    schema: WORDPRESS_NEWS_SCHEMA,
    request: {
      endpoint: API_ENDPOINT,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  });

  rio.registerResource({
    schema: WORDPRESS_MEDIA_SCHEMA,
    request: {
      endpoint: MEDIA_API_ENDPOINT,
      resourceType: 'json',
      headers: {
        'Access-Control-Request-Method': 'application/json',
      },
    },
  });
}
