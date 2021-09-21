import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import {
  NotificationHandlers,
  Firebase,
  handlePendingNotification,
  handleNotificationReceivedBackground,
} from './services';

export { appDidFinishLaunching } from './app';
export { NotificationHandlers, Firebase, handlePendingNotification };
export { consumeNotification, reducer, middleware } from './redux';

if (Platform.OS !== 'ios') {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    handleNotificationReceivedBackground(remoteMessage);
  });
}
