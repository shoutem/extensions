import FCM from 'react-native-fcm';

import { isProduction } from 'shoutem.application';

import {
  handleReceivedToken,
} from './services/fcm';

import { notificationReceived } from './actionCreators';

function appDidMount(app) {
  if (!isProduction()) {
    return;
  }

  const store = app.getStore();

  const { dispatch } = store;

  const dispatchNotificationAction = (receivedNotification) => {
    const { body, title, action, opened_from_tray } = receivedNotification;
    const notification = { body, openedFromTray: opened_from_tray, title };

    if (action) {
      try {
        const actionObject = JSON.parse(action);
        notification.action = actionObject;
      } catch (e) {
        console.log('Unable to parse notification action object', e);
      }
    }

    dispatch(notificationReceived(notification));
  };

  FCM.getFCMToken().then((token) => {
    handleReceivedToken(token, dispatch);
  });

  FCM.on('notification', dispatchNotificationAction);

  FCM.getInitialNotification().then((notification) => {
    if (notification) {
      dispatchNotificationAction({ ...notification, opened_from_tray: true });
    }
  });

  FCM.on('refreshToken', (token) => {
    handleReceivedToken(token, dispatch);
  });
}

export {
  appDidMount,
};
