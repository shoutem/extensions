import { AppState, Alert } from 'react-native';
import _ from 'lodash';
import { I18n } from 'shoutem.i18n';
import { NotificationHandlers, Firebase } from 'shoutem.firebase';
import { getNavigationInitialized } from 'shoutem.navigation';

import { ext, DEFAULT_PUSH_NOTIFICATION_GROUP } from './const';
import {
  displayPushNotificationMessage,
  getLastNotification,
  selectPushNotificationGroups,
  deviceTokenReceived,
  notificationReceived,
} from './redux';
import { resolveNotificationData } from './services';

export function dispatchNotification(receivedNotification, dispatch) {
  const action = _.get(receivedNotification, 'data.action') || _.get(receivedNotification, 'action');

  if (!action) {
    return;
  }

  const notification = resolveNotificationData(receivedNotification);

  if (!notification) {
    return;
  }

  try {
    const actionObject = JSON.parse(action);
    notification.action = actionObject;
  } catch (e) {
    console.log('Unable to parse notification action object', e);
  }

  if (notification.title || notification.body) {
    dispatch(notificationReceived(notification));
  }
}

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    Firebase.clearBadge();
  }
}

function handleTokenReceived(token, dispatch) {
  dispatch(deviceTokenReceived(token));
  dispatch(selectPushNotificationGroups({
    added: [DEFAULT_PUSH_NOTIFICATION_GROUP],
  }));
}

function createLocalAlert(notification, dispatch) {
  const action = _.get(notification, 'data.action') || _.get(notification, 'action');
  const resolvedAction = action && JSON.parse(action);
  const viewAction = {
    text: I18n.t(ext('messageReceivedAlertView')),
    onPress: () => dispatch(resolvedAction),
  };
  const defaultAction = {
    text: I18n.t(ext('messageReceivedAlertDismiss')),
    onPress: () => { },
  };

  const alertOptions = action ? [defaultAction, viewAction] : [defaultAction];

  Firebase.clearBadge();

  Alert.alert(
    I18n.t(ext('messageReceivedAlert')),
    notification.data.text,
    alertOptions,
  );
}

const appDidMount = (app) => {
  Firebase.clearBadge();
  const store = app.getStore();

  NotificationHandlers.registerTokenReceivedHandler({
    owner: ext(),
    onTokenReceived: handleTokenReceived,
  });
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: dispatchNotification,
      onNotificationReceivedForeground: createLocalAlert,
    },
  });

  AppState.addEventListener('change', handleAppStateChange);

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
};

const appWillUnmount = () => {
  AppState.removeEventListener('change', handleAppStateChange);
};

export {
  appDidMount,
  appWillUnmount,
};
