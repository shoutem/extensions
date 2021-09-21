import {
  consumeNotificationMiddleware,
  navInitializedMiddleware,
} from './middleware';
export {
  consumeNotification,
  queueNotification,
  clearNotificationQueue,
} from './actions';
export { default as reducer } from './reducer';
export { getQueuedNotification } from './selectors';

export const middleware = [
  consumeNotificationMiddleware,
  navInitializedMiddleware,
];
