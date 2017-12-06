import { combineReducers } from 'redux';
import {
  find,
  update,
  remove,
  create,
  getCollection,
  collection,
  storage,
} from '@shoutem/redux-io';
import { shoutemUrls } from 'src/services';
import ext from 'src/const';
import { moduleName, USER_GROUPS } from './const';

function getUserGroupsState(state) {
  return state[ext()][moduleName];
}

export function getUserGroups(state) {
  const userGroups = getUserGroupsState(state).userGroups;
  return getCollection(userGroups, state);
}

export function loadUserGroups(appId, scope = {}) {
  const config = {
    schema: USER_GROUPS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/groups{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('userGroups'), scope);
}

export function createUserGroup(appId, name, scope = {}) {
  const config = {
    schema: USER_GROUPS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/groups`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const group = {
    type: USER_GROUPS,
    attributes: { name },
  };

  return create(config, group, scope);
}

export function deleteUserGroup(appId, groupId, scope = {}) {
  const config = {
    schema: USER_GROUPS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/groups/${groupId}`),
      headers: {},
    },
  };

  const group = {
    type: USER_GROUPS,
    id: groupId,
  };
  return remove(config, group, scope);
}

export function updateUserGroup(appId, groupId, groupPatch, scope = {}) {
  const config = {
    schema: USER_GROUPS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(`/v1/realms/externalReference:${appId}/groups/${groupId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const group = {
    type: USER_GROUPS,
    id: groupId,
    attributes: groupPatch,
  };

  return update(config, group, scope);
}

export const reducer = combineReducers({
  [USER_GROUPS]: storage(USER_GROUPS),
  userGroups: collection(USER_GROUPS, ext('userGroups')),
});
