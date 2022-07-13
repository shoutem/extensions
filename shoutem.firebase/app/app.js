import { Platform } from 'react-native';
import PushNotifications from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import { isProduction } from 'shoutem.application';
import { Firebase } from 'shoutem.firebase';
import { priorities, setPriority } from 'shoutem-core';
import {
  handleNotification,
  handleNotificationReceivedBackground,
  handleNotificationReceivedForeground,
  handleNotificationTapped,
} from './services';

function formatiOSNotificationPayload(message) {
  return {
    ...message,
    title: message.notification.title,
    text: message.notification.body,
  };
}

export const appWillMount = setPriority(app => {
  if (!isProduction()) {
    return;
  }

  if (Platform.OS === 'ios') {
    messaging().onNotificationOpenedApp(message =>
      handleNotificationTapped(formatiOSNotificationPayload(message), store),
    );
  }

  const store = app.getStore();
  const { dispatch } = store;

  messaging()
    .registerDeviceForRemoteMessages()
    .then(() => {
      Firebase.obtainFCMToken()(dispatch);
      Firebase.obtainAPNSToken()(dispatch);
    });
}, priorities.FIREBASE);

export function appDidMount(app) {
  if (!isProduction()) {
    return;
  }

  const store = app.getStore();
  const { dispatch } = store;

  PushNotifications.configure({
    onNotification: notif => {
      const { foreground, userInteraction } = notif;

      const isForegroundNotification = foreground && userInteraction !== true;

      if (isForegroundNotification) {
        handleNotificationReceivedForeground(notif, dispatch);
      }

      if (
        foreground === false &&
        userInteraction !== true &&
        Platform.OS === 'ios'
      ) {
        handleNotificationReceivedBackground(notif, dispatch);
      }

      // iOS is excluded because onNotification handler is sometimes triggered twice
      // with userInteraction:true.
      // Because iOS excludes tapped notifications here, we have defined separate handler
      // messaging().onNotificationOpenedApp, for when app is killed and user opens it via
      // push notification tap
      if (userInteraction === true && Platform.OS !== 'ios') {
        handleNotificationTapped(notif, store);
      }

      // GENERIC Handler ( Use if you have custom logic or your library has some false positives with ShoutEm logic)
      handleNotification(notif, dispatch);

      if (Platform.OS === 'ios') {
        notif.finish(PushNotificationIOS.FetchResult.NoData);
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
