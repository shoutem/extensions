import _ from 'lodash';

import {
  Alert,
} from 'react-native';

import { ext } from './const';

import {
  selectPushNotificationGroups,
  userNotified,
  requestPushPermission,
} from './redux';

const DEFAULT_PUSH_NOTIFICATION_GROUP = 'broadcast';

const appDidMount = (app) => {
  const store = app.getStore();

  function getLastNotification() {
    const state = store.getState();
    return state[ext()].lastNotification;
  }

  function onNotificationAction(notificationContent) {
    const action = _.get(notificationContent, 'action');

    if (!!action) {
      store.dispatch(action);
    }
  }

  function displayPushNotificationMessage(notification) {
    const notificationContent = notification.content;
    store.dispatch(userNotified());
    Alert.alert(
      'Message received',
      notificationContent.title,
      [
        { text: 'View', onPress: onNotificationAction.bind(null, notificationContent) },
        { text: 'Dismiss', onPress: () => {} },
      ]
    );
  }

  store.subscribe(() => {
    const lastNotification = getLastNotification();

    if (lastNotification && !!lastNotification.notificationContent) {
      displayPushNotificationMessage(lastNotification.notificationContent);
    }
  });

  store.dispatch(requestPushPermission());

  // subscribe to the default push notification group
  store.dispatch(selectPushNotificationGroups({
    added: [DEFAULT_PUSH_NOTIFICATION_GROUP],
  }));
};

export {
  appDidMount,
};
