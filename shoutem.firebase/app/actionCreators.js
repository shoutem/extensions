import { DEVICE_TOKEN_RECEIVED, NOTIFICATION_RECEIVED } from 'shoutem.push-notifications';

/**
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

export function deviceTokenReceived(token) {
  return {
    type: DEVICE_TOKEN_RECEIVED,
    token,
  };
}
