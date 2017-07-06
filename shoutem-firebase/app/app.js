import FCM from 'react-native-fcm';

import { isProduction } from 'shoutem.application';

import { deviceTokenReceived, notificationReceived } from './actionCreators';

function appDidMount(app) {
  if (isProduction()) {
    const store = app.getStore();

    function dispatchNotificationAction(receivedNotification) {
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

      store.dispatch(notificationReceived(notification));
    }

    FCM.getFCMToken().then(token => {
      store.dispatch(deviceTokenReceived(token));
      // Display the FCM token only in development mode
      if (process.env.NODE_ENV === 'development') {
        console.log('Firebase device token:', token);
      }
    });

    FCM.on('notification', dispatchNotificationAction);

    FCM.getInitialNotification().then((notification) => {
      if (notification) {
        dispatchNotificationAction({...notification, opened_from_tray: true});
      }
    });
  }
}

export {
  appDidMount,
};
