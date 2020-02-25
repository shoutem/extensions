// This file is auto-generated.
import pack from './package.json';

export const STATUSES_SCHEMA = 'shoutem.social.statuses';
export const USERS_SCHEMA = 'shoutem.social.users';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
