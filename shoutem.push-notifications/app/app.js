import { AppState } from 'react-native';
import { Firebase } from 'shoutem.firebase';
import { getNavigationInitialized } from 'shoutem.navigation';
import { checkNotifications, requestNotifications, RESULTS } from 'react-native-permissions';
import { displayPushNotificationMessage, getLastNotification } from './redux';
import { registerNotificationHandlers } from './notificationHandlers';

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    Firebase.clearBadge();
  }
}

const appWillMount = () => {
  /**
   * Checks if the notification service has status DENIED => available on device but the permission has not been requested yet.
   * If status is DENIED, we request permissions and obtain FCM token if user grants permissions. 
   */
  checkNotifications().then(({ status }) => {
    if (status === RESULTS.DENIED) {
      requestNotifications(['alert', 'sound', 'badge']);
    }
  }).catch((error) => {
    console.log('Check push notification permissions failed:', error);
  });
};

const appDidMount = (app) => {
  Firebase.clearBadge();
  const store = app.getStore();

  registerNotificationHandlers(store);

  AppState.addEventListener('change', handleAppStateChange);

  // TODO: Check if we remove lastNotification reducer+middleware, and
  // replace store.subscribe() with onPendingNotificationDispatched handler
  // https://fiveminutes.jira.com/browse/SEEXT-8464
  store.subscribe(() => {
    const state = store.getState();
    const isNavigationInitialized = getNavigationInitialized(state);
    const lastNotification = getLastNotification(state);

    if (
      lastNotification &&
      !!lastNotification.notificationContent &&
      isNavigationInitialized
    ) {
      store.dispatch(
        displayPushNotificationMessage(lastNotification.notificationContent),
      );
    }
  });
};

const appWillUnmount = () => {
  AppState.removeEventListener('change', handleAppStateChange);
};

export { appWillMount, appDidMount, appWillUnmount };
