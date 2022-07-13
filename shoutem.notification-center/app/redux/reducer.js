import _ from 'lodash';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { chainReducers } from '@shoutem/redux-composers';
import { LOAD_SUCCESS, resource } from '@shoutem/redux-io';
import { isAppendMode } from '@shoutem/redux-io/actions/find';
import { canHandleAction } from '@shoutem/redux-io/reducers/resource';
import {
  busyStatus,
  setStatus,
  STATUS,
  updateStatus,
  validationStatus,
} from '@shoutem/redux-io/status';
import {
  DEVICE_TOKEN_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
} from 'shoutem.push-notifications';
import { preventStateRehydration } from 'shoutem.redux';
import { DEFAULT_REMINDER, DEFAULT_TIMEFRAME, ext } from '../const';
import {
  getNextActionLinks,
  getNextActionParams,
  hasNextPage,
  resolveNotification,
} from '../services';
import {
  CANCEL_JOURNEY,
  GROUPS_SCHEMA,
  MARK_AS_READ_SUCCESS,
  NOTIFICATIONS_SCHEMA,
  SAVE_JOURNEY,
  SELECTED_GROUPS_SCHEMA,
  SET_NOTIFICATION_SETTINGS,
} from './actions';

const DEFAULT_NOTIFICATION_STATE = { data: [] };
const DEFAULT_NOTIFICATION_SETTINGS_STATE = {
  dailyMessages: true,
  dailyMessagesSettings: DEFAULT_TIMEFRAME,
  remindMeToUseApp: true,
  reminderTimes: [DEFAULT_REMINDER],
};

const groups = resource(GROUPS_SCHEMA);

const deviceToken = (state = '', action) => {
  switch (action.type) {
    case DEVICE_TOKEN_RECEIVED:
      return action.token || null;
    default:
      return state;
  }
};

const manuallyUnsubscribedGroups = (state = [], action) => {
  switch (action.type) {
    case SELECT_PUSH_NOTIFICATION_GROUPS:
      return _.difference(
        _.union(state, action.payload.removed),
        action.payload.added,
      );
    default:
      return state;
  }
};

const selectedGroupsReducer = (state = [], action) => {
  switch (action.type) {
    case SELECT_PUSH_NOTIFICATION_GROUPS:
      return _.difference(
        _.union(state, action.payload.added),
        action.payload.removed,
      );
    default:
      return state;
  }
};

const selectedGroups = chainReducers([
  resource(SELECTED_GROUPS_SCHEMA),
  selectedGroupsReducer,
]);

const markNotificationAsRead = (state, action) => {
  const { data } = state;
  const {
    meta: { id },
  } = action;

  const notificationIndex = _.findIndex(data, { id });

  const updatedData = data.map((notification, index) => {
    if (index === notificationIndex) {
      return { ...notification, read: true };
    }

    return notification;
  });

  return { ...state, data: updatedData };
};

const processNotifications = (state, action) => {
  const { payload } = action;

  const notifications = payload.data.map(resolveNotification);
  const newState = isAppendMode(action)
    ? { ...state, data: [...state.data, ...notifications] }
    : { ...state, data: [...notifications] };
  const params = hasNextPage(payload) ? getNextActionParams(action) : {};
  const links = hasNextPage(payload)
    ? getNextActionLinks(action)
    : { next: null };

  setStatus(
    newState,
    updateStatus(state[STATUS], {
      validationStatus: validationStatus.VALID,
      busyStatus: busyStatus.IDLE,
      error: false,
      links,
      params,
      schema: NOTIFICATIONS_SCHEMA,
    }),
  );

  return newState;
};

export function notificationsReducer() {
  const defaultResourceReducer = resource(
    NOTIFICATIONS_SCHEMA,
    DEFAULT_NOTIFICATION_STATE,
  );

  return (state = DEFAULT_NOTIFICATION_STATE, action) => {
    const { type } = action;

    if (type === LOAD_SUCCESS) {
      if (canHandleAction(action, NOTIFICATIONS_SCHEMA)) {
        return processNotifications(state, action);
      }
      return state;
    }

    if (type === MARK_AS_READ_SUCCESS) {
      return markNotificationAsRead(state, action);
    }

    return defaultResourceReducer(state, action);
  };
}

export function notificationSettingsReducer(
  state = DEFAULT_NOTIFICATION_SETTINGS_STATE,
  action,
) {
  if (action.type === SET_NOTIFICATION_SETTINGS) {
    return { ...state, ...action.payload };
  }

  return state;
}

export function notificationJourneyReducer(state = {}, action) {
  const { type } = action;
  if (action.type === REHYDRATE) {
    return { ...action?.payload?.[ext()]?.notificationJourneys };
  }

  if (type === SAVE_JOURNEY) {
    const { payload } = action;

    return { ...state, ...payload };
  }

  if (type === CANCEL_JOURNEY) {
    const { payload } = action;

    return _.omit(state, payload.triggerId);
  }

  return state;
}

export const reducer = combineReducers({
  deviceToken,
  notifications: notificationsReducer(),
  notificationJourneys: preventStateRehydration(notificationJourneyReducer),
  notificationSettings: notificationSettingsReducer,
  groups,
  manuallyUnsubscribedGroups,
  selectedGroups,
});
