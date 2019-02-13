import _ from 'lodash';
import { find, create, invalidate } from '@shoutem/redux-io';
import { getAppId } from 'shoutem.application';
import { getUser } from 'shoutem.auth';

import { apiVersion } from '../app';
import { STATUSES_SCHEMA, USERS_SCHEMA } from '../const';
import { shoutemApi, adaptUserForSocialActions } from '../services';

export const CREATE = 'CREATE';
export const LOAD = 'LOAD';
export const LIKE = 'LIKE';
export const UNLIKE = 'UNLIKE';
export const DELETE = 'DELETE';

export function formatParams(paramsObject) {
  const appId = getAppId();
  let params = `nid=${appId}&version=${apiVersion}`;

  _.forOwn(paramsObject, (value, key) => {
    params += `&${key}=${encodeURIComponent(value)}`;
  });

  return params;
}

export function loadUser(userId) {
  return find(USERS_SCHEMA, '', { userId });
}

export function loadUsers() {
  return find(USERS_SCHEMA);
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
      endpoint: shoutemApi.buildUrl('/api/statuses/public_timeline.json', params),
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
    body.file_attachment = imageData.data;
  }

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      body: formatParams(body),
      endpoint: shoutemApi.buildUrl('/api/statuses/update.json'),
      method: 'POST',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  };

  return create(rioConfig, null, null, { operation: CREATE });
}

export function likeStatus(statusId) {
  const params = formatParams({
    design_mode: true,
  });

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: shoutemApi.buildUrl(`/api/favorites/create/${statusId}.json`, params),
      body: formatParams(),
      method: 'POST',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  };

  return (dispatch, getState) => {
    dispatch(create(rioConfig, null, null, {
      operation: LIKE,
      user: adaptUserForSocialActions(getUser(getState())),
    }));
  };
}

export function unlikeStatus(statusId) {
  const body = formatParams({
    design_mode: true,
  });

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
    dispatch(create(rioConfig, null, null, {
      operation: UNLIKE,
      user: adaptUserForSocialActions(getUser(getState())),
    }));
  };
}

export function invalidateSocialCollections() {
  const actions = [
    invalidate(STATUSES_SCHEMA),
  ];

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
      endpoint: shoutemApi.buildUrl('/api/statuses/replies.json', formatParams(params)),
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
  const params = formatParams({
    in_reply_to_status_id,
  });

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
  const params = {
    in_reply_to_status_id: statusId,
  };

  const body = {
    status: text,
    include_shoutem_fields: true,
    source: 'Mobile',
  };

  if (imageData) {
    body.file_attachment = imageData.data;
  }

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      body: formatParams(body),
      endpoint: shoutemApi.buildUrl('/api/statuses/update.json', formatParams(params)),
      method: 'POST',
      resourceType: 'JSON',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  };
  return create(rioConfig, null, params, { operation: CREATE });
}
