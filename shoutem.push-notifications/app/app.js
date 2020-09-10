import { AppState } from 'react-native';
import { Firebase } from 'shoutem.firebase';
import { getNavigationInitialized } from 'shoutem.navigation';
import { displayPushNotificationMessage, getLastNotification } from './redux';
import { registerNotificationHandlers } from './notificationHandlers';

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    Firebase.clearBadge();
  }
}

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

export { appDidMount, appWillUnmount };
