import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  NotificationHandlers,
  Firebase,
  handleNotificationReceivedBackground,
  handlePendingNotification,
} from './services';

export { appDidFinishLaunching } from './app';
export { NotificationHandlers, Firebase, handlePendingNotification };

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (Platform.OS === 'ios') {
    return;
  }

  handleNotificationReceivedBackground(remoteMessage);
});
