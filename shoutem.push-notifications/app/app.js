import { AppState } from 'react-native';
import { Firebase } from 'shoutem.firebase';
import {
  checkNotifications,
  requestNotifications,
  RESULTS,
} from 'shoutem.permissions';
import { before, priorities, setPriority } from 'shoutem-core';
import { registerNotificationHandlers } from './notificationHandlers';

let appStateListener;

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    Firebase.clearBadge();
  }
}

const appWillMount = setPriority(app => {
  const store = app.getStore();

  registerNotificationHandlers(store);

  /**
   * Checks if the notification service has status DENIED => available on device but the permission has not been requested yet.
   * If status is DENIED, we request permissions and obtain FCM token if user grants permissions.
   */
  checkNotifications()
    .then(({ status }) => {
      if (status === RESULTS.DENIED) {
        requestNotifications(['alert', 'sound', 'badge']);
      }
    })
    .catch(error => {
      console.log('Check push notification permissions failed:', error);
    });
}, before(priorities.FIREBASE));

const appDidMount = () => {
  appStateListener = AppState.addEventListener('change', handleAppStateChange);
};

const appWillUnmount = () => {
  appStateListener.remove();
};

export { appDidMount, appWillMount, appWillUnmount };
