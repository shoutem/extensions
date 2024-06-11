import { AppState } from 'react-native';
import _ from 'lodash';
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
}, before(priorities.FIREBASE));

const appDidMount = setPriority(() => {
  appStateListener = AppState.addEventListener('change', handleAppStateChange);

  /**
   * Checks if the notification service has status DENIED => available on device but the permission has not been requested yet.
   * If status is DENIED, we request permissions and obtain FCM token if user grants permissions. Delay this window
   * for a few seconds to allow other Alert.alert windows (shoutem.permissions generated alarm window) to stack before this one.
   */
  _.delay(
    () =>
      checkNotifications()
        .then(({ status }) => {
          if (status === RESULTS.DENIED) {
            requestNotifications(['alert', 'sound', 'badge']);
          }
        })
        .catch(error => {
          console.log('Check push notification permissions failed:', error);
        }),
    5000,
  );
}, before(priorities.FIREBASE));

const appWillUnmount = () => {
  appStateListener.remove();
};

export { appDidMount, appWillMount, appWillUnmount };
