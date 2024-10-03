import rio from '@shoutem/redux-io';
import { WP_CATEGORIES_REQUEST_HEADERS } from './const';
import {
  API_ENDPOINT,
  AUTHOR_API_ENDPOINT,
  CATEGORIES_ENDPOINT,
  MEDIA_API_ENDPOINT,
  WORDPRESS_AUTHOR_SCHEMA,
  WORDPRESS_CATEGORIES_SCHEMA,
  WORDPRESS_MEDIA_SCHEMA,
  WORDPRESS_NEWS_SCHEMA,
} from './redux';

export function appDidMount() {
  rio.registerResource({
    schema: WORDPRESS_NEWS_SCHEMA,
    request: {
      endpoint: API_ENDPOINT,
      resourceType: 'json',
      headers: WP_CATEGORIES_REQUEST_HEADERS,
    },
  });

  rio.registerResource({
    schema: WORDPRESS_MEDIA_SCHEMA,
    request: {
      endpoint: MEDIA_API_ENDPOINT,
      resourceType: 'json',
      headers: WP_CATEGORIES_REQUEST_HEADERS,
    },
  });

  rio.registerResource({
    schema: WORDPRESS_CATEGORIES_SCHEMA,
    request: {
      endpoint: CATEGORIES_ENDPOINT,
      resourceType: 'json',
      headers: WP_CATEGORIES_REQUEST_HEADERS,
    },
  });

  rio.registerResource({
    schema: WORDPRESS_AUTHOR_SCHEMA,
    request: {
      endpoint: AUTHOR_API_ENDPOINT,
      resourceType: 'json',
      headers: WP_CATEGORIES_REQUEST_HEADERS,
    },
  });
}
