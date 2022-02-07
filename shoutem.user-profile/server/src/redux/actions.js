import _ from 'lodash';
import { find, prev } from '@shoutem/redux-io';
import { ext } from '../const';
import { shoutemUrls } from '../services';
import { next } from '@shoutem/redux-io';

export const USERS = 'shoutem.core.users';
export const USER_GROUPS = 'shoutem.core.user-groups';

export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;
export const MAX_PAGE_LIMIT = 1000;

function transformFilter(filter) {
  return _.mapKeys(filter, (_value, key) => `filter[${key}]`);
}

export function loadUsers(
  appId,
  filter = {},
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
) {
  const params = {
    q: {
      'page[limit]': limit,
      'page[offset]': offset,
      sort: '-_id',
      ...transformFilter(filter),
    },
  };

  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/users{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('currentUsersPage'), params);
}

export function loadAllUserGroups(appId) {
  const config = {
    schema: USER_GROUPS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/groups{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  const params = {
    q: {
      'page[limit]': MAX_PAGE_LIMIT,
    },
  };

  return find(config, ext('allUserGroups'), params);
}

export function loadNextUsersPage(users) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return next(users, false, config);
}

export function loadPreviousUsersPage(users) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return prev(users, false, config);
}
