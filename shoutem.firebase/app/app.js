import { Platform } from 'react-native';
import PushNotifications from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';

import { isProduction } from 'shoutem.application';
import {
  handleReceivedToken,
  handleNotificationReceivedForeground,
  handleNotificationReceivedBackground,
  handleNotificationTapped,
  handleFCMTokenReceived,
} from './services';

function formatiOSNotificationPayload(message) {
  return {
    ...message,
    title: message.notification.title,
    text: message.notification.body,
  };
}

export function appDidFinishLaunching(app) {
  if (!isProduction()) {
    return;
  }

  const store = app.getStore();
  const { dispatch } = store;

  if (Platform.OS === 'ios') {
    messaging().onNotificationOpenedApp((message) =>
      handleNotificationTapped(formatiOSNotificationPayload(message), dispatch),
    );
  }

  messaging()
    .getToken()
    .then((token) => handleFCMTokenReceived(token, dispatch))
    .catch(err => console.warn('Fetch Firebase token failed!', err));

  PushNotifications.configure({
    onRegister: (token) => handleReceivedToken(token, dispatch),
    onNotification: (notif) => {
      const { foreground, userInteraction } = notif;

      if (Platform.OS === 'ios') {
        notif.finish(PushNotificationIOS.FetchResult.NoData);
      }

      if (foreground && userInteraction !== true) {
        handleNotificationReceivedForeground(notif, dispatch);
      }

      if (foreground === false && Platform.OS === 'ios') {
        handleNotificationReceivedBackground(notif, dispatch);
      }

      if (
        (userInteraction === true && Platform.OS !== 'ios') ||
        (userInteraction === undefined && !foreground)
      ) {
        handleNotificationTapped(notif, dispatch);
      }
    },
    permissions: {
      alert: true,
      badge: true,
      sound: true,
    },
    popInitialNotification: true,
    requestPermissions: isProduction(),
  });
}
