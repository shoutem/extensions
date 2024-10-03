import PushNotifications, { Importance } from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import messaging from '@react-native-firebase/messaging';
import _ from 'lodash';
import { isAndroid } from 'shoutem-core';
import { handleAPNSTokenReceived, handleFCMTokenReceived } from './handlers';

function requestPermissions() {
  PushNotifications.requestPermissions();
}

function subscribeToTopic(topic) {
  messaging().subscribeToTopic(topic);
}

function unsubscribeFromTopic(topic) {
  messaging().unsubscribeFromTopic(topic);
}

function obtainFCMToken() {
  return dispatch =>
    messaging()
      .getToken()
      .then(token => handleFCMTokenReceived(token, dispatch))
      // eslint-disable-next-line no-console
      .catch(err => console.warn('Fetch Firebase token failed!', err));
}

function obtainAPNSToken() {
  return dispatch =>
    messaging()
      .getAPNSToken()
      .then(token => handleAPNSTokenReceived(token, dispatch))
      // eslint-disable-next-line no-console
      .catch(err => console.warn('Fetch APNS token failed!', err));
}

function clearBadge() {
  if (isAndroid) {
    return null;
  }

  // Apple natively expects -1 value for when we want to clear badge and NOT all
  // app notifications too, in Notification Centre (lock screen).
  // If we pass 0, all notifications would be clear too... That is not desired UX.
  return PushNotificationIOS.setApplicationIconBadgeNumber(-1);
}

function selectGroups(groups) {
  const { added = [], removed = [] } = groups;

  _.forEach(added, group => subscribeToTopic(group));
  _.forEach(removed, group => unsubscribeFromTopic(group));
}

function presentLocalNotification(config) {
  PushNotifications.localNotification(config);
}

function scheduleLocalNotification(config) {
  PushNotifications.localNotificationSchedule(config);
}

function scheduleLocalNotificationIos(config) {
  // react-native-push-notification has a iOS bug for local repeating notifications
  // It'll only fire once, then scheduled notification's date becomes null value
  // https://github.com/zo0r/react-native-push-notification/issues/1842
  // TODO: use react-native-push-notification after it's fixed
  PushNotificationIOS.addNotificationRequest(config);
}

function createNotificationChannels(channels) {
  return new Promise(resolve => {
    _.forEach(channels, channelConfig => {
      PushNotifications.channelExists(
        channelConfig.channelId,
        channelExists => {
          if (!channelExists) {
            const config = {
              ...channelConfig,
              importance: Importance.HIGH, // (optional) default: Importance.HIGH. Int value of the Android notification importance
            };

            PushNotifications.createChannel(config);
          }
        },
      );
    });

    resolve();
  });
}

export default {
  createNotificationChannels,
  requestPermissions,
  subscribeToTopic,
  unsubscribeFromTopic,
  obtainFCMToken,
  obtainAPNSToken,
  selectGroups,
  presentLocalNotification,
  scheduleLocalNotification,
  scheduleLocalNotificationIos,
  clearBadge,
};
