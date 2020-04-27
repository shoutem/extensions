import { Alert } from 'react-native';
import _ from 'lodash';

import { NAVIGATION_INITIALIZED } from 'shoutem.navigation';
import { I18n } from 'shoutem.i18n';

import {
  SHOW_PUSH_NOTIFICATION,
  displayPushNotificationMessage,
  getLastNotification,
} from './redux';

import { ext } from './const';

function onNotificationAction(notificationContent, store) {
  const action = _.get(notificationContent, 'action');

  if (!!action) {
    store.dispatch(action);
  }
}

export const showInitialNotification = store => next => action => {
  if (action.type !== NAVIGATION_INITIALIZED) {
    return next(action);
  }

  const state = store.getState();
  const lastNotification = getLastNotification(state);

  if (!_.isEmpty(lastNotification)) {
    store.dispatch(displayPushNotificationMessage(lastNotification.notificationContent));
  }

  return next(action);
}

// eslint-disable-next-line no-unused-vars
export const showNotification = store => next => action => {
  if (action.type !== SHOW_PUSH_NOTIFICATION) {
    return next(action);
  }

  const notificationContent = _.get(action, 'payload.notification');

  if (notificationContent.openedFromTray) {
    return onNotificationAction(notificationContent, store);
  }

  Alert.alert(
    I18n.t(ext('messageReceivedAlert')),
    notificationContent.body,
    [
      {
        text: I18n.t(ext('messageReceivedAlertView')),
        onPress: onNotificationAction.bind(null, notificationContent, store),
      },
      {
        text: I18n.t(ext('messageReceivedAlertDismiss')),
        onPress: () => {}
      },
    ]
  );
};
