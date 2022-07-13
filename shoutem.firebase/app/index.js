import { Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';
import {
  Firebase,
  handleNotificationReceivedBackground,
  handlePendingNotification,
  NotificationHandlers,
} from './services';

export { appDidMount, appWillMount } from './app';
export { Firebase, handlePendingNotification, NotificationHandlers };
export {
  consumeNotification,
  middleware,
  queueNotification,
  reducer,
} from './redux';

if (Platform.OS !== 'ios') {
  messaging().setBackgroundMessageHandler(async remoteMessage => {
    handleNotificationReceivedBackground(remoteMessage);
  });
}
