// This file is auto-generated.
import { isWeb } from 'shoutem-core';
import pack from './package.json';

export const POSTS_PER_PAGE = 20;

export const WP_CATEGORIES_REQUEST_HEADERS = {
  ...(isWeb
    ? { 'Content-Type': 'application/json' }
    : { 'Access-Control-Request-Method': 'application/json' }),
};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
