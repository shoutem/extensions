// This file is auto-generated.
import pack from './package.json';

export const apiVersion = '59';

export const STATUSES_SCHEMA = 'shoutem.social.statuses';
export const USERS_SEARCH_SCHEMA = 'shoutem.core.user-search-actions';
export const SOCIAL_SETTINGS_SCHEMA = 'shoutem.social.settings';

export const DEFAULT_USER_SETTINGS = {
  commentsOnMyStatuses: true,
  likesOnMyStatuses: true,
  commentsOnCommentedStatuses: true,
  commentsOnLikedStatuses: false,
  type: SOCIAL_SETTINGS_SCHEMA,
};

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
