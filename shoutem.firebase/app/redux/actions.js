import { ext } from '../const';

export const CONSUME_NOTIFICATION = ext('CONSUME_NOTIFICATION');
export const QUEUE_NOTIFICATION = ext('QUEUE_NOTIFICATION');
export const CLEAR_NOTIFICATION_QUEUE = ext('CLEAR_NOTIFICATION_QUEUE');

export function consumeNotification(notification) {
  return {
    type: CONSUME_NOTIFICATION,
    payload: notification,
  };
}

export function queueNotification(notification) {
  return {
    type: QUEUE_NOTIFICATION,
    payload: notification,
  };
}

export function clearNotificationQueue() {
  return { type: CLEAR_NOTIFICATION_QUEUE };
}
