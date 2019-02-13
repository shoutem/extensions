import _ from 'lodash';
import { combineReducers } from 'redux';

import { APPEND_MODE } from '@shoutem/redux-io/actions/find';
import { mapReducers } from '@shoutem/redux-composers';
import {
  resource,
  LOAD_SUCCESS,
  CREATE_SUCCESS,
  REFERENCE_STATUS,
} from '@shoutem/redux-io';

import {
  setStatus,
  updateStatus,
  validationStatus,
  busyStatus,
  STATUS,
} from '@shoutem/redux-io/status';

import { STATUSES_SCHEMA, USERS_SCHEMA } from '../const';
import { CREATE, LIKE, UNLIKE, DELETE } from './actions';
import {
  increaseNumberOfComments,
  decreaseNumberOfComments,
  appendStatus,
  removeStatus,
  updateStatusesAfterLike,
  updateStatusesAfterUnlike,
} from '../services';

const DEFAULT_STATE = { data: [] };

function isAppendMode(action) {
  return !!(_.get(action, ['meta', 'options', APPEND_MODE]));
}

function processStatuses(state, action) {
  const { payload } = action;

  const newState = isAppendMode(action)
    ? { ...state, data: [...state.data, ...payload.data] }
    : { ...state, data: [...payload.data] };

  const hasNextPage = !!_.get(payload, 'paging');

  const params = hasNextPage ? _.get(action, 'meta.params') : {};
  const next = hasNextPage ? _.get(action, 'payload.paging.next') : null;

  setStatus(newState, updateStatus(
    state[STATUS],
    {
      validationStatus: validationStatus.VALID,
      busyStatus: busyStatus.IDLE,
      error: false,
      links: { next },
      params,
      schema: STATUSES_SCHEMA,
    }
  ));

  return newState;
}

function unpackUser(user) {
  return {
    id: user.id,
    ...user.relationships,
    ...user.attributes,
  };
}

function processUsers(state, action) {
  const { payload } = action;

  // for now, always refetch single users to avoid unknown incompatibilities between social and auth
  if (!_.isArray(payload.data)) {
    // meet the new state, same as the old state
    const newState = { ...state, data: [...state.data] };
    setStatus(newState, updateStatus(
      state[STATUS],
      {
        validationStatus: validationStatus.VALID,
        busyStatus: busyStatus.IDLE,
        error: false,
        schema: USERS_SCHEMA,
      }
    ));

    return newState;
  }

  const data = _.map(payload.data, unpackUser);

  const newState = isAppendMode(action)
    ? { ...state, data: [...state.data, ...data] }
    : { ...state, data: [...data] };

  const nextPageUrl = _.get(payload, 'links.next');
  const links = nextPageUrl ? { next: nextPageUrl } : { next: null };

  setStatus(newState, updateStatus(
    state[STATUS],
    {
      validationStatus: validationStatus.VALID,
      busyStatus: busyStatus.IDLE,
      error: false,
      links,
      schema: USERS_SCHEMA,
    }
  ));

  return newState;
}

function statusesReducer(prepend) {
  const defaultResourceReducer = resource(STATUSES_SCHEMA, DEFAULT_STATE);

  return (state, action) => {
    const operation = _.get(action, 'meta.options.operation');
    const schema = _.get(action, 'meta.schema');

    switch (action.type) {
      case LOAD_SUCCESS:
        if (schema === STATUSES_SCHEMA) {
          return processStatuses(state, action);
        }

        return state;

      case REFERENCE_STATUS:
        if (schema === STATUSES_SCHEMA) {
          setStatus(state, updateStatus(
            state[STATUS],
            {
              validationStatus: validationStatus.INVALID,
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));
        }

        return state;

      case CREATE_SUCCESS:
        const user = _.get(action, 'meta.options.user', {});
        const statusId = _.get(action, 'payload.id');
        const liked = _.get(action, 'payload.liked');

        if (operation === CREATE) {
          const newStatuses = appendStatus(state.data, action.payload, prepend);

          const newState = { ...state, data: newStatuses };
          setStatus(newState, updateStatus(
            state[STATUS],
            {
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));

          return newState;
        }

        if (operation === LIKE) {
          const newStatuses = updateStatusesAfterLike(state.data, statusId, user, liked);
          const newState = { ...state, data: newStatuses };

          setStatus(newState, updateStatus(
            state[STATUS],
            {
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));

          return newState;
        }

        if (operation === UNLIKE) {
          const newStatuses = updateStatusesAfterUnlike(state.data, statusId, user.id, liked);
          const newState = { ...state, data: newStatuses };

          setStatus(newState, updateStatus(
            state[STATUS],
            {
              busyStatus: busyStatus.IDLE,
              error: false,
            }
          ));

          return newState;
        }

        if (operation === DELETE) {
          const newStatuses = removeStatus(state.data, statusId);
          const newState = { ...state, data: newStatuses };

          setStatus(newState, state[STATUS]);
          return newState;
        }

        return state;
      default:
        return defaultResourceReducer(state, action);
    }
  };
}

function wallReducer() {
  const statuses = statusesReducer(true);

  return (state = DEFAULT_STATE, action) => {
    const actionIsStatus = !_.get(action, 'meta.params.in_reply_to_status_id');

    if (actionIsStatus) {
      return statuses(state, action);
    }

    if (action.type === CREATE_SUCCESS) {
      const operation = _.get(action, 'meta.options.operation');

      if (operation === CREATE) {
        const statusId = action.payload.in_reply_to_status_id;
        const statuses = increaseNumberOfComments(state.data, statusId);

        const newState = { ...state, data: statuses };
        setStatus(newState, updateStatus(
          state[STATUS],
          {
            validationStatus: validationStatus.VALID,
            busyStatus: busyStatus.IDLE,
            error: false,
          }
        ));

        return newState;
      }

      if (operation === DELETE) {
        const statusId = action.payload.in_reply_to_status_id;
        const statuses = decreaseNumberOfComments(state.data, statusId);

        const newState = { ...state, data: statuses };
        setStatus(newState, state[STATUS]);

        return newState;
      }
    }

    return state;
  };
}

function commentsReducer() {
  const comments = statusesReducer(false);

  return (state = DEFAULT_STATE, action) => {
    const actionIsStatus = !_.get(action, 'meta.params.in_reply_to_status_id');
    if (actionIsStatus) {
      return state;
    }

    return comments(state, action);
  };
}

function usersReducer() {
  const defaultResourceReducer = resource(USERS_SCHEMA, DEFAULT_STATE);

  return (state = DEFAULT_STATE, action) => {
    const schema = _.get(action, 'meta.schema');

    switch (action.type) {
      case LOAD_SUCCESS:
        if (schema === USERS_SCHEMA) {
          return processUsers(state, action);
        }

        return state;
      default:
        return defaultResourceReducer(state, action);
    }
  };
}

export default combineReducers({
  statuses: wallReducer(),
  comments: mapReducers(
    'meta.params.in_reply_to_status_id',
    commentsReducer()
  ),
  users: usersReducer(),
});
