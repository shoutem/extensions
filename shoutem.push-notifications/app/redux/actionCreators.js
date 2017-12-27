import {
  USER_NOTIFIED,
  REQUEST_PUSH_PERMISSION,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  SHOW_PUSH_NOTIFICATION,
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
 * @see REQUEST_PUSH_PERMISSION
 * Used for triggering push notification permission request
 * @returns {{type: String}}
 */
export function requestPushPermission() {
  return { type: REQUEST_PUSH_PERMISSION };
}

/**
 * @see SELECT_PUSH_NOTIFICATION_GROUPS
 * Used for triggering push notification group subscription
 * @param added - notification groups which need to be added to subscribed groups
 * @param removed - notification groups which need to be removed from subscribed groups
 * @returns {{type: String, payload: {added: [], removed: []}}}
 */
export function selectPushNotificationGroups({ added, removed }) {
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
    }
  };
}
