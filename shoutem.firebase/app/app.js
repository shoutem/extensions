import PushNotifications from 'react-native-push-notification';
import messaging from '@react-native-firebase/messaging';
import { isProduction } from 'shoutem.application';
import { priorities, setPriority } from 'shoutem-core';
import {
  Firebase,
  handleNotificationReceivedForeground,
  handleNotificationTapped,
} from './services';

let unsubscribeForegroundNotificationListener;

function formatiOSNotificationPayload(message) {
  return {
    ...message,
    title: message.notification.title,
    text: message.notification.body,
  };
}

export const appWillMount = setPriority(async app => {
  if (!isProduction()) {
    return;
  }

  const store = app.getStore();
  const { dispatch } = store;

  // Android & iOS - Handles notification received when in FOREGROUND state.
  unsubscribeForegroundNotificationListener = messaging().onMessage(
    async remoteMessage =>
      handleNotificationReceivedForeground(remoteMessage, dispatch),
  );

  // Android & iOS - Handles notification tapped when app is in BACKGROUND state.
  // iOS - Handles notification tapped when app is in QUIT state.
  messaging().onNotificationOpenedApp(message =>
    handleNotificationTapped(formatiOSNotificationPayload(message), store),
  );

  // Android - Handles notification tapped when app is in QUIT state.
  messaging()
    .getInitialNotification()
    .then(remoteMessage => {
      if (remoteMessage) {
        handleNotificationTapped(remoteMessage, store);
      }
    });

  await messaging().registerDeviceForRemoteMessages();

  await Firebase.obtainAPNSToken()(dispatch);
  await Firebase.obtainFCMToken()(dispatch);
}, priorities.FIREBASE);

export function appDidMount(app) {
  if (!isProduction()) {
    return;
  }

  // We're only handling local notifications here & notification tapped event only.
  // The rest is handled by messaging().onMessage,  messaging().onNotificationOpenedApp() & messaging().setBackgroundMessageHandler.
  PushNotifications.configure({
    onNotification: notif => {
      // google.message_id (Android) & gcm.message_id (iOS) are present in remote notifications.
      if (
        !!notif.data?.['google.message_id'] ||
        !!notif.data?.['gcm.message_id'] ||
        !notif.userInteraction
      ) {
        return;
      }

      const store = app.getStore();
      handleNotificationTapped(notif, store);
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

export function appWillUnmount() {
  unsubscribeForegroundNotificationListener();
}
