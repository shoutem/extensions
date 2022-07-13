import { SET_NAVIGATION_INITIALIZED } from 'shoutem.navigation';
import {
  handleNotificationConsumed,
  handleNotificationTapped,
} from '../services';
import { CONSUME_NOTIFICATION } from './actions';
import { getQueuedNotification } from './selectors';

export const consumeNotificationMiddleware = store => next => action => {
  if (action.type === CONSUME_NOTIFICATION) {
    handleNotificationConsumed(action.payload);
  }

  return next(action);
};

export const navInitializedMiddleware = store => next => action => {
  if (action.type === SET_NAVIGATION_INITIALIZED) {
    const state = store.getState();
    const queuedNotification = getQueuedNotification(state);

    if (queuedNotification) {
      handleNotificationTapped(queuedNotification, store, true);
    }
  }

  return next(action);
};
