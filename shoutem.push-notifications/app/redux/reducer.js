import { combineReducers } from 'redux';
import {
  NOTIFICATION_RECEIVED,
  USER_NOTIFIED,
  SET_PENDING_NOTIFICATION,
  CLEAR_PENDING_NOTIFICATION,
} from './actionTypes';

function addPushNotification(state = {}, action) {
  switch (action.type) {
    case NOTIFICATION_RECEIVED:
      return { notificationContent: action };
    case USER_NOTIFIED:
      return {};
    default:
      return state;
  }
}

function pendingNotification(state = {}, action) {
  if (action.type === SET_PENDING_NOTIFICATION) {
    return action.payload;
  }

  if (action.type === CLEAR_PENDING_NOTIFICATION) {
    return {};
  }

  return state;
}

export default combineReducers({
  lastNotification: addPushNotification,
  pendingNotification,
});
