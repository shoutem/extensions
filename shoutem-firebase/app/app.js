import FCM from 'react-native-fcm';

import { notificationReceived } from './actionCreators';

function appDidMount(app) {
  const store = app.getStore();

  function dispatchNotificationAction(receivedNotification) {
    const { title, action } = receivedNotification;
    const notification = { title };

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

  // Display the FCM token only in development mode
  if (process.env.NODE_ENV === 'development') {
    FCM.getFCMToken().then(token => {
      console.log('Firebase device token:', token);
    });
  }

  FCM.on('notification', dispatchNotificationAction);
}

export {
  appDidMount,
};
