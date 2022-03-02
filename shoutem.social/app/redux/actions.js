/* eslint-disable camelcase */
import _ from 'lodash';
import {
  create,
  find,
  invalidate,
  next,
  REFERENCE_FETCHED,
  update,
} from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application/app';
import { getUser, USER_SCHEMA } from 'shoutem.auth';
import { openInModal } from 'shoutem.navigation';
import { ext as userProfileExt } from 'shoutem.user-profile';
import {
  apiVersion,
  DEFAULT_USER_SETTINGS,
  SOCIAL_SETTINGS_SCHEMA,
  STATUSES_SCHEMA,
  USERS_SEARCH_SCHEMA,
} from '../const';
import { shoutemApi } from '../services/shoutemApi';
import { getStatus } from './selectors';

export const CREATE = 'CREATE';
export const LOAD = 'LOAD';
export const LIKE = 'LIKE';
export const UNLIKE = 'UNLIKE';
export const DELETE = 'DELETE';
export const BLOCK_USER = 'BLOCK_USER';
export const UNBLOCK_USER = 'UNBLOCK_USER';

export function openProfile(user) {
  return openInModal(userProfileExt('UserProfileScreen'), { user });
}

function resolveUsername(user) {
  return (
    _.get(user, 'profile.nick') || _.get(user, 'profile.firstName') || 'someone'
  );
}

export function blockUser(userId, currentUserId) {
  return {
    type: BLOCK_USER,
    payload: {
      userId: _.toString(userId),
      currentUserId: _.toString(currentUserId),
    },
  };
}

export function unblockUser(userId, currentUserId) {
  return {
    type: UNBLOCK_USER,
    payload: {
      userId: _.toString(userId),
      currentUserId: _.toString(currentUserId),
    },
  };
}

export function loadSocialSettings(legacyId) {
  return find(SOCIAL_SETTINGS_SCHEMA, 'settings', { userId: legacyId });
}

export function createSocialSettings(settings, legacyId) {
  return create(SOCIAL_SETTINGS_SCHEMA, settings, { userId: legacyId });
}

// Create default user settings if there are none present. Also,
// load the one collection with the newly created set of settings for
// the current user.
export function initUserSettings(legacyId) {
  return dispatch => {
    return dispatch(loadSocialSettings(legacyId)).catch(error => {
      const errorCode = _.get(error, 'payload.response.errors[0].code');

      if (errorCode === 'settings_notFound_settingsNotFound') {
        return dispatch(
          createSocialSettings(DEFAULT_USER_SETTINGS, legacyId),
        ).then(res =>
          dispatch({
            payload: [res.payload.data],
            type: REFERENCE_FETCHED,
            meta: {
              schema: SOCIAL_SETTINGS_SCHEMA,
              tag: 'settings',
            },
          }),
        );
      }

      return null;
    });
  };
}

export function updateSocialSettings(patch, settingsId, legacyId) {
  return update(
    SOCIAL_SETTINGS_SCHEMA,
    { attributes: patch, type: SOCIAL_SETTINGS_SCHEMA, id: settingsId },
    { userId: legacyId, settingsId },
  );
}

// moved here from services/user to avoid cyclic dependencies
export function adaptUserForSocialActions(user) {
  const legacyId = _.get(user, 'legacyId', -1);
  const first_name = _.get(user, 'profile.firstName', '');
  const last_name = _.get(user, 'profile.lastName', '');

  return {
    id: parseInt(legacyId, 10),
    screen_name: _.get(user, 'profile.nickname', ''),
    email: _.get(user, 'profile.username', ''),
    profile_image_url: _.get(user, 'profile.image', ''),
    name: `${first_name} ${last_name}`,
    first_name,
    last_name,
  };
}

export function formatParams(paramsObject) {
  const appId = getAppId();
  let params = `nid=${appId}&version=${apiVersion}`;

  _.forOwn(paramsObject, (value, key) => {
    params += `&${key}=${encodeURIComponent(value)}`;
  });

  return params;
}

export function loadUser(userId) {
  return find(USER_SCHEMA, '', { userId });
}

export function loadUsers() {
  return find(USER_SCHEMA, 'users');
}

export function searchUsers(searchTerm) {
  const body = {
    data: {
      type: USERS_SEARCH_SCHEMA,
      attributes: {
        query: `%${searchTerm}%`,
      },
    },
  };

  const config = {
    schema: USER_SCHEMA,
    request: {
      method: 'POST',
      endpoint: shoutemApi.buildAuthUrl('users/actions/search'),
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'searchUsers');
}

export function loadUsersInGroups(visibleGroups) {
  const queryParam = `filter[userGroups]=${visibleGroups.join(',')}`;
  const config = {
    schema: USER_SCHEMA,
    request: {
      endpoint: shoutemApi.buildAuthUrl('users', queryParam),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, 'usersInGroups');
}

export function searchUsersNextPage(searchTerm, currentData) {
  const body = {
    data: {
      type: USERS_SEARCH_SCHEMA,
      attributes: {
        query: `%${searchTerm}%`,
      },
    },
  };

  const config = {
    request: {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return next(currentData, true, config);
}

export function loadStatuses() {
  const params = formatParams({
    include_shoutem_fields: true,
    include_anonymous_shouts: true,
    standard_response: true,
    count: 15,
  });

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: shoutemApi.buildUrl(
        '/api/statuses/public_timeline.json',
        params,
      ),
      method: 'GET',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return find(rioConfig, '', {}, { operation: LOAD });
}

export function deleteStatus(status) {
  const { id } = status;
  const params = formatParams();

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: shoutemApi.buildUrl(`/api/statuses/destroy/${id}.json`, params),
      method: 'POST',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return create(rioConfig, null, { id }, { operation: DELETE });
}

export function createStatus(text, imageData) {
  const body = {
    status: text,
    include_shoutem_fields: true,
  };

  if (imageData) {
    body.file_attachment = imageData;
  }

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      body: formatParams(body),
      endpoint: shoutemApi.buildUrl('/api/statuses/update.json'),
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  };

  return create(rioConfig, null, null, { operation: CREATE });
}

export function likeStatus(statusId) {
  return (dispatch, getState) => {
    const state = getState();
    const user = getUser(state);
    const authorId = getStatus(state, statusId).user.id;
    const userId = user.legacyId;
    const body = {
      data: {
        appId: getAppId(),
        authorId,
        username: resolveUsername(user),
      },
    };

    const rioConfig = {
      schema: STATUSES_SCHEMA,
      request: {
        endpoint: shoutemApi.buildCloudUrl(
          `/v1/users/legacyId:${userId}/actions/like/${statusId}`,
        ),
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      },
    };

    dispatch(
      create(rioConfig, null, null, {
        operation: LIKE,
        user: adaptUserForSocialActions(user),
      }),
    );
  };
}

export function unlikeStatus(statusId) {
  const body = formatParams({ design_mode: true });

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      body,
      endpoint: shoutemApi.buildUrl(`/api/favorites/destroy/${statusId}.json`),
      method: 'POST',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  };

  return (dispatch, getState) => {
    dispatch(
      create(rioConfig, null, null, {
        operation: UNLIKE,
        user: adaptUserForSocialActions(getUser(getState())),
      }),
    );
  };
}

export function invalidateSocialCollections() {
  const actions = [invalidate(STATUSES_SCHEMA)];

  return dispatch => Promise.all(_.map(actions, dispatch));
}

export function loadComments(statusId) {
  const params = {
    include_shoutem_fields: true,
    offset: 0,
    limit: 6,
    count: 10,
    in_reply_to_status_id: statusId,
  };

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: shoutemApi.buildUrl(
        '/api/statuses/replies.json',
        formatParams(params),
      ),
      method: 'GET',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return find(rioConfig, '', params, { operation: LOAD });
}

export function deleteComment(comment) {
  const { id, in_reply_to_status_id } = comment;
  const params = formatParams({ in_reply_to_status_id });

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: shoutemApi.buildUrl(`/api/statuses/destroy/${id}.json`, params),
      method: 'POST',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/json',
      },
    },
  };

  return create(rioConfig, null, { id }, { operation: DELETE });
}

export function createComment(statusId, text, imageData) {
  return (dispatch, getState) => {
    const state = getState();
    const user = getUser(state);
    const authorId = getStatus(state, statusId).user.id;
    const params = { in_reply_to_status_id: statusId };
    const userId = user.legacyId;
    const body = {
      data: {
        appId: getAppId(),
        authorId,
        text,
        username: resolveUsername(user),
      },
    };

    if (imageData) {
      body.data.imageData = imageData;
    }

    const rioConfig = {
      schema: STATUSES_SCHEMA,
      request: {
        endpoint: shoutemApi.buildCloudUrl(
          `/v1/users/legacyId:${userId}/actions/comment/${statusId}`,
        ),
        body: JSON.stringify(body),
        method: 'POST',
        headers: {
          'Content-Type': 'application/vnd.api+json',
        },
      },
    };

    return dispatch(
      create(rioConfig, null, params, {
        operation: CREATE,
      }),
    );
  };
}
