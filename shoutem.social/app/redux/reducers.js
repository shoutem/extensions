import _ from 'lodash';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { mapReducers } from '@shoutem/redux-composers';
import {
  cloneStatus,
  collection,
  CREATE_SUCCESS,
  LOAD_SUCCESS,
  one,
  REFERENCE_STATUS,
  resource,
  storage,
} from '@shoutem/redux-io';
import { APPEND_MODE } from '@shoutem/redux-io/actions/find';
import {
  busyStatus,
  setStatus,
  STATUS,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import { USER_SCHEMA } from 'shoutem.auth';
import { ext, SOCIAL_SETTINGS_SCHEMA, STATUSES_SCHEMA } from '../const';
import {
  appendStatus,
  decreaseNumberOfComments,
  increaseNumberOfComments,
  removeStatus,
  updateStatusesAfterLike,
  updateStatusesAfterUnlike,
} from '../services';
import {
  BLOCK_USER,
  CLEAR_DRAFT,
  CREATE,
  DELETE,
  LIKE,
  SAVE_DRAFT,
  UNBLOCK_USER,
  UNLIKE,
} from './actions';

const DEFAULT_STATE = { data: [] };
const DEFAULT_BLOCKED_USERS_STATE = {};

function isAppendMode(action) {
  return !!_.get(action, ['meta', 'options', APPEND_MODE]);
}

function isLoadSingleStatusAction(action) {
  return _.get(action, 'meta.options.loadSingleStatus');
}

function replaceStatus(state, action) {
  const newState = { ...state };

  const prevStatusIndex = _.findIndex(
    newState.data,
    status => status.id === action.payload.id,
  );

  if (prevStatusIndex >= 0) {
    newState.data[prevStatusIndex] = action.payload;
  }

  return newState;
}

function processStatuses(state, action) {
  const { payload } = action;

  let newState;

  // Single status is loaded after comment is deleted - find it in state & replace
  // with updated data
  if (isLoadSingleStatusAction(action)) {
    newState = replaceStatus(state, action);

    // clone status to keep links and other RIO status values
    cloneStatus(state, newState);
    // cloned status has "busy" state status - update to idle
    setStatus(
      newState,
      updateStatus(state[STATUS], {
        busyStatus: busyStatus.IDLE,
      }),
    );
  } else {
    newState = isAppendMode(action)
      ? { ...state, data: [...state.data, ...payload.data] }
      : { ...state, data: [...payload.data] };

    const hasNextPage = !!_.get(payload, 'paging');

    const params = hasNextPage ? _.get(action, 'meta.params') : {};
    const next = hasNextPage ? _.get(action, 'payload.paging.next') : null;

    setStatus(
      newState,
      updateStatus(state[STATUS], {
        validationStatus: validationStatus.VALID,
        busyStatus: busyStatus.IDLE,
        error: false,
        links: { next },
        params,
        schema: STATUSES_SCHEMA,
      }),
    );
  }

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
          setStatus(
            state,
            updateStatus(state[STATUS], {
              validationStatus: validationStatus.INVALID,
              busyStatus: busyStatus.IDLE,
              error: false,
            }),
          );
        }

        return state;

      case CREATE_SUCCESS: {
        const user = _.get(action, 'meta.options.user', {});
        const statusId = _.get(action, 'meta.options.statusId', null);
        const liked = _.get(action, 'payload.liked');

        if (operation === CREATE) {
          const newStatuses = appendStatus(state.data, action.payload, prepend);

          const newState = { ...state, data: newStatuses };
          setStatus(
            newState,
            updateStatus(state[STATUS], {
              busyStatus: busyStatus.IDLE,
              error: false,
            }),
          );

          return newState;
        }

        if (operation === LIKE) {
          const newStatuses = updateStatusesAfterLike(
            state.data,
            statusId,
            user,
            liked,
          );
          const newState = { ...state, data: newStatuses };

          setStatus(
            newState,
            updateStatus(state[STATUS], {
              busyStatus: busyStatus.IDLE,
              error: false,
            }),
          );

          return newState;
        }

        if (operation === UNLIKE) {
          const newStatuses = updateStatusesAfterUnlike(
            state.data,
            statusId,
            user.id,
            liked,
          );
          const newState = { ...state, data: newStatuses };

          setStatus(
            newState,
            updateStatus(state[STATUS], {
              busyStatus: busyStatus.IDLE,
              error: false,
            }),
          );

          return newState;
        }

        if (operation === DELETE) {
          const newStatuses = removeStatus(state.data, statusId);

          const newState = { ...state, data: newStatuses };

          setStatus(
            newState,
            updateStatus(state[STATUS], {
              busyStatus: busyStatus.IDLE,
              error: false,
            }),
          );

          return newState;
        }

        return state;
      }
      default:
        return defaultResourceReducer(state, action);
    }
  };
}

function blockedUsersReducer() {
  return (state = DEFAULT_BLOCKED_USERS_STATE, action) => {
    if (action.type === REHYDRATE) {
      return { ..._.get(action, ['payload', ext(), 'blockedUsers']) };
    }

    if (action.type === BLOCK_USER) {
      const { userId, currentUserId } = action.payload;

      if (userId === currentUserId) {
        return state;
      }

      const blockedUsers = _.get(state, currentUserId, []);

      return {
        ...state,
        [currentUserId]: _.uniq([...blockedUsers, userId]),
      };
    }

    if (action.type === UNBLOCK_USER) {
      const { userId, currentUserId } = action.payload;
      const blockedUsers = _.get(state, currentUserId, []);

      return {
        ...state,
        [currentUserId]: _.without(blockedUsers, userId),
      };
    }

    return state;
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
        setStatus(
          newState,
          updateStatus(state[STATUS], {
            validationStatus: validationStatus.VALID,
            busyStatus: busyStatus.IDLE,
            error: false,
          }),
        );

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
    const actionIsComment = _.get(action, 'meta.params.in_reply_to_status_id');

    if (actionIsComment) {
      return comments(state, action);
    }

    return state;
  };
}

function statusDraftReducer(state = null, action) {
  if (action.type === SAVE_DRAFT) {
    return action.payload;
  }

  if (action.type === CLEAR_DRAFT) {
    return null;
  }

  return state;
}

export default combineReducers({
  statuses: wallReducer(),
  statusDraft: statusDraftReducer,
  comments: mapReducers('meta.params.in_reply_to_status_id', commentsReducer()),
  users: collection(USER_SCHEMA, 'users'),
  usersInGroups: collection(USER_SCHEMA, 'usersInGroups'),
  blockedUsers: blockedUsersReducer(),
  allBlockedUsers: collection(USER_SCHEMA, 'blockedUsers'),
  searchUsers: collection(USER_SCHEMA, 'searchUsers'),
  settings: storage(SOCIAL_SETTINGS_SCHEMA),
  userSettings: one(SOCIAL_SETTINGS_SCHEMA, 'settings'),
});
