import messaging from '@react-native-firebase/messaging';
import {
  Firebase,
  handleNotificationReceivedBackground,
  handlePendingNotification,
  NotificationHandlers,
} from './services';

export { appDidMount, appWillMount, appWillUnmount } from './app';
export { Firebase, handlePendingNotification, NotificationHandlers };
export {
  consumeNotification,
  middleware,
  queueNotification,
  reducer,
} from './redux';

// Android & iOS - Handles notification received when in BACKGROUND and QUIT state.
// NOTE: This event will only be triggered if push notification has high priority set. Currently, only user
// scheduled push notification sent from builder will trigger this.
messaging().setBackgroundMessageHandler(async remoteMessage =>
  handleNotificationReceivedBackground(remoteMessage),
);
