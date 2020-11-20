// This file is auto-generated.
import pack from './package.json';

export const STATUSES_SCHEMA = 'shoutem.social.statuses';
export const USERS_SEARCH_SCHEMA = 'shoutem.core.user-search-actions';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
