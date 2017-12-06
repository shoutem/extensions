import _ from 'lodash';
import URI from 'urijs';
import { combineReducers } from 'redux';

import { APPEND_MODE } from '@shoutem/redux-io/actions/find';
import { mapReducers } from '@shoutem/redux-composers';
import { find, resource, create, LOAD_SUCCESS, CREATE_SUCCESS } from '@shoutem/redux-io';
import { navigateTo } from '@shoutem/core/navigation';

import {
  setStatus,
  updateStatus,
  validationStatus,
  busyStatus,
  STATUS,
} from '@shoutem/redux-io/status';

import { getAppId } from 'shoutem.application';
import { getUser } from 'shoutem.auth';

import { apiVersion, getApiEndpoint } from './app';
import { adaptUserForSocialActions } from './services/userProfileDataAdapter';

import { ext } from './const';

export const STATUSES_SCHEMA = 'shoutem.social.statuses';
export const USERS_SCHEMA = 'shoutem.social.users';

const CREATE = 'CREATE';
const LOAD = 'LOAD';
const LIKE = 'LIKE';
const UNLIKE = 'UNLIKE';
const DELETE = 'DELETE';

const DEFAULT_STATE = { data: [] };

function canHandleOperation(action, operation) {
  return (_.get(action, 'meta.options.operation') === operation);
}

function canHandleAction(action, schema) {
  return (_.get(action, 'meta.schema') === schema);
}

function getNextActionParams(action) {
  return {
    ..._.get(action, 'meta.params'),
  };
}

function getNextActionLinks(action) {
  return {
    next: _.get(action, 'payload.paging.next'),
  };
}

function getStatusIdFromAction(action) {
  return _.get(action, 'payload.id');
}

function getUserIdFromAction(action) {
  return _.get(action, 'meta.options.user.id');
}

function getUsersWhoLiked(status) {
  return _.get(status, 'shoutem_favorited_by.users');
}

export function isAppendMode(action) {
  return !!(_.get(action, ['meta', 'options', APPEND_MODE]));
}

function hasNextPage(payload) {
  return !!_.get(payload, 'paging');
}

const processStatuses = (state, action) => {
  const { payload } = action;

  const newState = isAppendMode(action)
    ? { ...state, data: [...state.data, ...payload.data] }
    : { ...state, data: [...payload.data] };
  const params = hasNextPage(payload) ? getNextActionParams(action) : {};
  const links = hasNextPage(payload) ? getNextActionLinks(action) : { next: null };

  setStatus(newState, updateStatus(
    state[STATUS],
    {
      validationStatus: validationStatus.VALID,
      busyStatus: busyStatus.IDLE,
      error: false,
      links,
      params,
      schema: STATUSES_SCHEMA,
    }
  ));

  return newState;
};

const appendNewStatus = (state, action, prepend) => {
  const newStatus = {
    ...action.payload,
    shoutem_reply_count: 0,
    shoutem_favorited_by: { count: 0, users: [] },
  };

  if (prepend) {
    return { ...state, data: [newStatus, ...state.data] };
  }
  return { ...state, data: [...state.data, newStatus] };
};

const removeStatus = (state, action) => {
  return { ...state, data: state.data.filter(status => status.id !== action.payload.id) };
};

const updateStatusesAfterLike = (state, action) => ({
  ...state,
  data: _.map(state.data, (status) => {
    if (status.id === getStatusIdFromAction(action) && !status.liked) {
      return {
        ...status,
        liked: action.payload.liked,
        shoutem_favorited_by: {
          ...status.shoutem_favorited_by,
          count: status.shoutem_favorited_by.count + 1,
          users: [
            {
              id: action.meta.options.user.id,
              name: action.meta.options.user.name,
              first_name: action.meta.options.user.first_name,
              last_name: action.meta.options.user.last_name,
              profile_image_url: action.meta.options.user.profile_image_url,
            },
            ...getUsersWhoLiked(status),
          ],
        },
      };
    }
    return status;
  }),
});

const updateStatusesAfterUnlike = (state, action) => ({
  ...state,
  data: _.map(state.data, (status) => {
    if (status.id === getStatusIdFromAction(action) && status.liked) {
      return {
        ...status,
        liked: action.payload.liked,
        shoutem_favorited_by: {
          ...status.shoutem_favorited_by,
          count: status.shoutem_favorited_by.count - 1,
          users: _.reject(getUsersWhoLiked(status), { id: getUserIdFromAction(action) }),
        },
      };
    }
    return status;
  }),
});

const increaseNumberOfComments = (state, action) => ({
  ...state,
  data: _.map(state.data, (status) => {
    if (status.id === action.payload.in_reply_to_status_id) {
      return {
        ...status,
        shoutem_reply_count: status.shoutem_reply_count + 1,
      };
    }
    return status;
  }),
});

const decreaseNumberOfComments = (state, action) => ({
  ...state,
  data: _.map(state.data, (status) => {
    if (status.id === action.payload.in_reply_to_status_id) {
      return {
        ...status,
        shoutem_reply_count: status.shoutem_reply_count - 1,
      };
    }
    return status;
  }),
});

function isComment(action) {
  return !!_.get(action, 'meta.params.in_reply_to_status_id');
}

function isStatus(action) {
  return !isComment(action);
}

const statusesReducer = (prepend) => {
  const defaultResourceReducer = resource(STATUSES_SCHEMA, DEFAULT_STATE);

  return (state, action) => {

    const { payload, type } = action;
    switch (type) {
      // Load statuses/comments
      case LOAD_SUCCESS:
        if (canHandleAction(action, STATUSES_SCHEMA)) {
          return processStatuses(state, action);
        }
        return state;
      case CREATE_SUCCESS:
        // If a new status/comment is created
        if (canHandleOperation(action, CREATE)) {
          const newState = appendNewStatus(state, action, prepend);
          setStatus(newState, updateStatus(
            state[STATUS],
            {
              validationStatus: validationStatus.VALID,
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));

          return newState;

        // If status is liked
        } else if (canHandleOperation(action, LIKE)) {
          const newState = updateStatusesAfterLike(state, action);
          setStatus(newState, updateStatus(
            state[STATUS],
            {
              validationStatus: validationStatus.VALID,
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));

          return newState;

        // If status is unliked
        } else if (canHandleOperation(action, UNLIKE)) {
          const newState = updateStatusesAfterUnlike(state, action);
          setStatus(newState, updateStatus(
            state[STATUS],
            {
              validationStatus: validationStatus.VALID,
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));

          return newState;

        // If status/comment is deleted
        } else if (canHandleOperation(action, DELETE)) {
          const newState = removeStatus(state, action);
          setStatus(newState, state[STATUS]);

          return newState;
        }

        return state;
      default:
        return defaultResourceReducer(state, action);
    }
  };
};

const wallReducer = () => {
  const statuses = statusesReducer(true);

  return (state = DEFAULT_STATE, action) => {
    const { payload, type } = action;

    if (!isStatus(action)) {
      if (type === CREATE_SUCCESS) {
        // If a new comment is created
        if (canHandleOperation(action, CREATE)) {
          const newState = increaseNumberOfComments(state, action);
          setStatus(newState, updateStatus(
            state[STATUS],
            {
              validationStatus: validationStatus.VALID,
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));

          return newState;

        // If a comment is deleted
        } else if (canHandleOperation(action, DELETE)) {
          const newState = decreaseNumberOfComments(state, action);
          setStatus(newState, state[STATUS]);

          return newState;
        }
      }

      return state;
    }

    return statuses(state, action);
  };
};

const commentsReducer = () => {
  const statuses = statusesReducer(false);

  return (state = DEFAULT_STATE, action) => {
    if (!isComment(action)) {
      return state;
    }

    return statuses(state, action);
  };
};

const processUsers = (state, action) => {
  const { payload } = action;

  const newState = isAppendMode(action)
    ? { ...state, data: [...state.data, ...payload.users] }
    : { ...state, data: [...payload.users] };
  const cursor = _.get(payload, 'next_cursor');
  const params = cursor ? {
    ...getNextActionParams(action),
    cursor,
  } : {};

  // Legacy API endpoint always returns a cursor property, even when there are no more pages.
  // This results in endless requests.
  // Since we don't know what the page size is, we end the cycle when the users response is empty.
  const hasMore = cursor && !_.isEmpty(payload.users);

  const nextPageUrl = createUsersApiEndpoint('all.json', formatParams(params));
  const links = hasMore ? { next: nextPageUrl } : { next: null };

  setStatus(newState, updateStatus(
    state[STATUS],
    {
      validationStatus: validationStatus.VALID,
      busyStatus: busyStatus.IDLE,
      error: false,
      links,
      params,
      schema: USERS_SCHEMA,
    }
  ));

  return newState;
};

const usersReducer = () => {
  const defaultResourceReducer = resource(USERS_SCHEMA, DEFAULT_STATE);

  return (state = DEFAULT_STATE, action) => {

    const { type } = action;
    switch (type) {
      // Load users
      case LOAD_SUCCESS:
        if (canHandleAction(action, USERS_SCHEMA)) {
          return processUsers(state, action);
        }
        return state;
      default:
        return defaultResourceReducer(state, action)
    }
  };
};

export default combineReducers({
  statuses: wallReducer(),
  comments: mapReducers('meta.params.in_reply_to_status_id', commentsReducer()),
  users: usersReducer(),
});

export function formatParams(paramsObject) {
  const appId = getAppId();
  let params = `nid=${appId}&version=${apiVersion}`;

  _.forOwn(paramsObject, (value, key) => {
    params += `&${key}=${encodeURIComponent(value)}`;
  });

  return params;
}

const apiRequestOptions = {
  resourceType: 'JSON',
  headers: {
    'Content-Type': 'application/json',
  },
};

const apiPostRequestOptions = {
  resourceType: 'JSON',
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded',
  },
};

function createStatusesApiEndpoint(path, queryStringParams) {
  const endpoint = new URI(`${getApiEndpoint()}/api/statuses/${path}`);

  return endpoint
    .protocol('https')
    .query(`${queryStringParams}`)
    .toString();
}

function createFavoritesApiEndpoint(path, queryStringParams, action) {
  const endpoint = new URI(`${getApiEndpoint()}/api/favorites/${action}/${path}`);

  return endpoint
    .protocol('https')
    .query(`${queryStringParams}`)
    .toString();
}

function createUsersApiEndpoint(path, queryStringParams) {
  const endpoint = new URI(`${getApiEndpoint()}/api/users/${path}`);

  return endpoint
    .protocol('https')
    .query(`${queryStringParams}`)
    .toString();
}

export function fetchStatuses() {
  const params = {
    include_shoutem_fields: true,
    include_anonymous_shouts: true,
    standard_response: true,
    count: 15,
  };

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: createStatusesApiEndpoint('public_timeline.json', formatParams(params)),
      method: 'GET',
      ...apiRequestOptions,
    },
  };

  return find(rioConfig, '', { }, { operation: LOAD });
}

export function fetchComments(statusId) {
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
      endpoint: createStatusesApiEndpoint('replies.json', formatParams(params)),
      method: 'GET',
      ...apiRequestOptions,
    },
  };
  return find(rioConfig, '', params, {
    operation: LOAD,
  });
}

export function fetchUsers() {
  const params = {
    include_shoutem_fields: true,
    cursor: 0,
    count: 16,
  };

  const rioConfig = {
    schema: USERS_SCHEMA,
    request: {
      endpoint: createUsersApiEndpoint('all.json', formatParams(params)),
      method: 'GET',
      ...apiRequestOptions,
    },
  };

  return find(rioConfig, '');
}

export function deleteStatus(status) {
  const { id } = status;
  const params = {
    id,
  }

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: createStatusesApiEndpoint('destroy/{id}.json', formatParams()),
      method: 'POST',
      ...apiRequestOptions,
    },
  };

  return create(rioConfig, null, params, { operation: DELETE });
}

export function deleteComment(comment) {
  const { id, in_reply_to_status_id } = comment;
  const params = {
    id,
  };
  const qs = {
    in_reply_to_status_id,
  }

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: createStatusesApiEndpoint('destroy/{id}.json', formatParams(qs)),
      method: 'POST',
      ...apiRequestOptions,
    },
  };

  return create(rioConfig, null, params, { operation: DELETE });
}

export function createStatus(text, imageData) {
  const body = {
    status: text,
    include_shoutem_fields: true,
  };

  if (imageData) body.file_attachment = imageData.data;

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: createStatusesApiEndpoint('update.json', ''),
      body: formatParams(body),
      method: 'POST',
      ...apiPostRequestOptions,
    },
  };

  return create(rioConfig, null, null, { operation: CREATE });
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

  if (imageData) body.file_attachment = imageData.data;

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: createStatusesApiEndpoint('update.json', formatParams(params)),
      method: 'POST',
      body: formatParams(body),
      ...apiPostRequestOptions,
    },
  };
  return create(rioConfig, null, params, { operation: CREATE });
}

export function likeStatus(statusId) {
  const params = {
    design_mode: true,
  };

  const body = {};

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: createFavoritesApiEndpoint(`${statusId}.json`, formatParams(params), 'create'),
      body: formatParams(body),
      method: 'POST',
      ...apiPostRequestOptions,
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
  const body = { design_mode: true };

  const rioConfig = {
    schema: STATUSES_SCHEMA,
    request: {
      endpoint: createFavoritesApiEndpoint(`${statusId}.json`, '', 'destroy'),
      body: formatParams(body),
      method: 'POST',
      ...apiPostRequestOptions,
    },
  };
  return (dispatch, getState) => {
    dispatch(create(rioConfig, null, null, {
      operation: UNLIKE,
      user: adaptUserForSocialActions(getUser(getState())),
    }));
  };
}
