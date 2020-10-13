import { Platform } from 'react-native';
import PushNotifications from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';

import { isProduction } from 'shoutem.application';
import { Firebase } from 'shoutem.firebase';
import {
  handleNotificationReceivedForeground,
  handleNotificationReceivedBackground,
  handleNotificationTapped,
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
    messaging().onNotificationOpenedApp(message => handleNotificationTapped(
      formatiOSNotificationPayload(message),
      dispatch,
    ));
  }

  messaging().registerDeviceForRemoteMessages().then(() => {
    Firebase.obtainFCMToken()(dispatch);
    Firebase.obtainAPNSToken()(dispatch);
  });

  PushNotifications.configure({
    onNotification: (notif) => {
      const { foreground, userInteraction } = notif;

      const isForegroundNotification = foreground && userInteraction !== true;

      if (Platform.OS === 'ios' && !isForegroundNotification) {
        notif.finish(PushNotificationIOS.FetchResult.NoData);
      }

      if (isForegroundNotification) {
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
    requestPermissions: false,
  });
}
