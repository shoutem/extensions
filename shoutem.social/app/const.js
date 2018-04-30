import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const STATUSES_SCHEMA = 'shoutem.social.statuses';
export const USERS_SCHEMA = 'shoutem.social.users';
