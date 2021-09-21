import _ from 'lodash';
import { find, next, prev, create, update, remove } from '@shoutem/redux-io';
import { shoutemUrls } from 'src/services';
import ext from 'src/const';
import { USER_GROUPS } from 'src/modules/user-groups';
import { USERS, DEFAULT_LIMIT, DEFAULT_OFFSET } from '../const';

function transformFilter(filter) {
  return _.mapKeys(filter, (value, key) => `filter[${key}]`);
}

export function loadUsers(
  appId,
  filter = {},
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  scope = {},
) {
  const params = {
    q: {
      'page[limit]': limit,
      'page[offset]': offset,
      sort: '-_id',
      ...transformFilter(filter),
    },
    ...scope,
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

export function createUser(appId, user, scope = {}) {
  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/users`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const { firstName, lastName, nick, userGroups, ...otherProps } = user;

  const newUser = {
    type: USERS,
    attributes: {
      profile: { firstName, lastName, nick },
      ...otherProps,
    },
    relationships: {
      userGroups: {
        data: _.map(userGroups, group => ({ id: group, type: USER_GROUPS })),
      },
    },
  };

  return create(config, newUser, scope);
}

export function deleteUser(appId, userId, scope = {}) {
  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/users/${userId}`,
      ),
      headers: {},
    },
  };

  const user = { type: USERS, id: userId };
  return remove(config, user, scope);
}

export function changePassword(appId, userId, password) {
  const body = {
    data: {
      type: 'shoutem.auth.set-password-actions',
      id: userId,
      attributes: {
        password,
      },
    },
  };

  const config = {
    schema: 'shoutem.auth.set-password-actions',
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/users/${userId}/actions/set-password`,
      ),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      body: JSON.stringify(body),
    },
  };

  return find(config, 'set-user-password');
}

export function updateUser(appId, userId, userPatch, scope = {}) {
  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/users/${userId}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const { name, nick, userGroups, ...otherProps } = userPatch;

  const userGroupRelationship = userGroups
    ? {
        userGroups: {
          data: _.map(userGroups, group => ({ id: group, type: USER_GROUPS })),
        },
      }
    : null;

  const updatedUser = {
    type: USERS,
    id: userId,
    attributes: {
      profile: { name, nick },
      ...otherProps,
    },
    relationships: userGroupRelationship,
  };

  return update(config, updatedUser, scope);
}

export function downloadUserData(appId) {
  const headers = new Headers();
  headers.append('Accept', 'application/zip');

  const downloadUsersDataRequest = new Request(
    shoutemUrls.buildAuthUrl(
      `/v1/realms/externalReference:${appId}/users/actions/export`,
    ),
    {
      method: 'POST',
      headers,
    },
  );

  return fetch(downloadUsersDataRequest);
}
