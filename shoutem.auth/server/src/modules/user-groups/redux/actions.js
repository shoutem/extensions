import { find, update, remove, create, next, prev } from '@shoutem/redux-io';
import { shoutemUrls } from 'src/services';
import ext from 'src/const';
import {
  USER_GROUPS,
  MAX_PAGE_LIMIT,
  DEFAULT_LIMIT,
  DEFAULT_OFFSET,
} from '../const';

export function loadAllUserGroups(appId, scope = {}) {
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
    ...scope,
  };

  return find(config, ext('allUserGroups'), params);
}

export function loadUserGroups(
  appId,
  limit = DEFAULT_LIMIT,
  offset = DEFAULT_OFFSET,
  scope = {},
) {
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
      'page[limit]': limit,
      'page[offset]': offset,
    },
    ...scope,
  };

  return find(config, ext('userGroups'), params);
}

export function createUserGroup(appId, name, scope = {}) {
  const config = {
    schema: USER_GROUPS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/groups`,
      ),
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
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/groups/${groupId}`,
      ),
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
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/groups/${groupId}`,
      ),
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

export function loadNextUserGroupsPage(userGroups) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return next(userGroups, false, config);
}

export function loadPreviousUserGroupsPage(userGroups) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return prev(userGroups, false, config);
}
