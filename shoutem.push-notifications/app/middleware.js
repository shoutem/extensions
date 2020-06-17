import _ from 'lodash';
import { NAVIGATION_INITIALIZED } from 'shoutem.navigation';
import {
  SHOW_PUSH_NOTIFICATION,
  displayPushNotificationMessage,
  getLastNotification,
} from './redux';

function onNotificationAction(notificationContent, store) {
  const action = _.get(notificationContent, 'action');

  if (action) {
    store.dispatch(action);
  }
}

export const showInitialNotification = store => next => (action) => {
  if (action.type !== NAVIGATION_INITIALIZED) {
    return next(action);
  }

  const state = store.getState();
  const lastNotification = getLastNotification(state);

  if (!_.isEmpty(lastNotification)) {
    store.dispatch(displayPushNotificationMessage(lastNotification.notificationContent));
  }

  return next(action);
};

// eslint-disable-next-line no-unused-vars
export const showNotification = store => next => (action) => {
  if (action.type !== SHOW_PUSH_NOTIFICATION) {
    return next(action);
  }

  const notificationContent = _.get(action, 'payload.notification');

  return onNotificationAction(notificationContent, store);
};
