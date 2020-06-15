import _ from 'lodash';
import { Firebase } from 'shoutem.firebase';
import {
  USER_NOTIFIED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  SHOW_PUSH_NOTIFICATION,
  DEVICE_TOKEN_RECEIVED,
  NOTIFICATION_RECEIVED,
} from './actionTypes';

/**
 * @see USER_NOTIFIED
 * Used for updating the last received notification's state
 * @returns {{type: String}}
 */
export function userNotified() {
  return { type: USER_NOTIFIED };
}

/**
 * @see NOTIFICATION_RECEIVED
 * Emits the received notification
 * @param notification
 * @returns {{type: String, content: Object}}
 */
export function notificationReceived(notification) {
  return {
    type: NOTIFICATION_RECEIVED,
    content: notification,
  };
}

/**
 * @see SELECT_PUSH_NOTIFICATION_GROUPS
 * Used for triggering push notification group subscription
 * @param added - notification groups which need to be added to subscribed groups
 * @param removed - notification groups which need to be removed from subscribed groups
 * @returns {{type: String, payload: {added: [], removed: []}}}
 */
export function selectPushNotificationGroups({ added, removed }) {
  Firebase.selectGroups({ added, removed });
  return {
    type: SELECT_PUSH_NOTIFICATION_GROUPS,
    payload: {
      added,
      removed,
    },
  };
}

/**
 * @see SHOW_PUSH_NOTIFICATION
 * Used for displaying a push notification when the app is open
 * @param notification - the notification to display
 * @returns {{type: String, payload: {notification: Object}}}
 */
export function showPushNotification(notification) {
  return {
    type: SHOW_PUSH_NOTIFICATION,
    payload: {
      notification,
    },
  };
}

/**
 * @see SHOW_PUSH_NOTIFICATION
 * @see USER_NOTIFIED
 * Clears lastNotification from global state and shows latest push notification
 * @param notification - the notification to display
 */
export function displayPushNotificationMessage(notification) {
  return (dispatch) => {
    const notificationContent = _.get(notification, 'content');

    dispatch(userNotified());
    dispatch(showPushNotification(notificationContent));
  };
}

export function deviceTokenReceived(token) {
  return {
    type: DEVICE_TOKEN_RECEIVED,
    token,
  };
}
