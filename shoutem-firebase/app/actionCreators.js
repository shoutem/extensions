import { NOTIFICATION_RECEIVED } from 'shoutem.push-notifications';

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
