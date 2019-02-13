import { combineReducers } from 'redux';
import _ from 'lodash';
import {
  find,
  next,
  prev,
  create,
  update,
  remove,
  collection,
  storage,
  getCollection,
} from '@shoutem/redux-io';
import { shoutemUrls } from 'src/services';
import ext from 'src/const';
import { USER_GROUPS } from 'src/modules/user-groups';
import {
  moduleName,
  USERS,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from './const';

// SELECTORS
function getUsersState(state) {
  return state[ext()][moduleName];
}

export function getUsers(state) {
  const users = getUsersState(state).currentUsersPage;
  return getCollection(users, state);
}

function transformFilter(filter) {
  return _.mapKeys(filter, (value, key) => `filter[${key}]`);
}

// ACTIONS
export function loadUsers(
  appId,
  filter = {},
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  scope = {}
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
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/users{?q*}`),
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
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/users`),
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
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/users/${userId}`),
      headers: {},
    },
  };

  const user = { type: USERS, id: userId };
  return remove(config, user, scope);
}

export function updateUser(appId, userId, userPatch, scope = {}) {
  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/users/${userId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const { name, nick, userGroups, ...otherProps } = userPatch;

  const userGroupRelationship = userGroups ? {
    userGroups: {
      data: _.map(userGroups, group => ({ id: group, type: USER_GROUPS })),
    },
  } : null;

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

export const reducer = combineReducers({
  storage: storage(USERS),
  currentUsersPage: collection(USERS, ext('currentUsersPage')),
});
