import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  NotificationHandlers,
  Firebase,
  handleNotificationReceivedBackground,
} from './services';

export { appDidFinishLaunching } from './app';
export { NotificationHandlers, Firebase };

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  if (Platform.OS === 'ios') {
    return;
  }

  handleNotificationReceivedBackground(remoteMessage);
});
