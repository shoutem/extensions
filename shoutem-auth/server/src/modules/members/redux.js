import { combineReducers } from 'redux';
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
} from '@shoutem/redux-io'
import { shoutemUrls } from 'src/services';
import ext from 'src/const';

// CONST
export const moduleName = 'members';
export const MEMBERS = 'shoutem.core.members';
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

// SELECTORS
function getMembersState(state) {
  return state[ext()][moduleName];
}

export function getMembers(state) {
  const members = getMembersState(state).currentMemberPage;
  return getCollection(members, state);
}

// ACTIONS
export function loadMembers(appId, filter, limit = 10, offset = 0, scope = {}) {
  const params = {
    q: {
      'filter[searchTerm]': filter,
      'page[limit]': limit,
      'page[offset]': offset,
    },
    ...scope,
  };

  const config = {
    schema: MEMBERS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/members{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('currentMemberPage'), params);
}

export function loadNextMembersPage(members) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      }
    },
  };

  return next(members, false, config);
}

export function loadPreviousMembersPage(members) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      }
    },
  };

  return prev(members, false, config);
}

export function createMember(appId, member, scope = {}) {
  const config = {
    schema: MEMBERS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/members`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newMember = {
    type: MEMBERS,
    attributes: { appId, ...member },
  };

  return create(config, newMember, scope);
}

export function deleteMember(appId, memberId, scope = {}) {
  const config = {
    schema: MEMBERS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/members/${memberId}`),
      headers: {},
    },
  };

  const member = { type: MEMBERS, id: memberId };
  return remove(config, member, scope);
}

export function updateMember(appId, member, scope = {}) {
  const { id: memberId } = member;

  const config = {
    schema: MEMBERS,
    request: {
      endpoint: shoutemUrls.buildLegacyUrl(`/v1/apps/${appId}/members/${memberId}`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
      method: 'PUT',
    },
  };

  const newMember = {
    type: MEMBERS,
    id: memberId,
    attributes: { ...member, appId },
  };

  return update(config, newMember, scope);
}

export default combineReducers({
  storage: storage(MEMBERS),
  currentMemberPage: collection(MEMBERS, ext('currentMemberPage')),
});
