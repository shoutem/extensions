import { AppState } from 'react-native';

import { getNavigationInitialized } from 'shoutem.navigation';

import { ext } from './const';
import {
  displayPushNotificationMessage,
  getLastNotification,
  selectPushNotificationGroups,
  userNotified,
  requestPushPermission,
  showPushNotification,
} from './redux';

const DEFAULT_PUSH_NOTIFICATION_GROUP = 'broadcast';

let appStateChangeHandler; // Dynamically created handler;

const appDidMount = (app) => {
  const store = app.getStore();

  store.subscribe(() => {
    const state = store.getState();
    const isNavigationInitialized = getNavigationInitialized(state);
    const lastNotification = getLastNotification(state);

    if (
      lastNotification &&
      !!lastNotification.notificationContent &&
      isNavigationInitialized
    ) {
      store.dispatch(displayPushNotificationMessage(lastNotification.notificationContent));
    }
  });

  store.dispatch(requestPushPermission());
};

const appWillUnmount = () => {
  AppState.removeEventListener('change', appStateChangeHandler);
};

export {
  appDidMount,
  appWillUnmount,
};
