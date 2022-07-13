import { getExtensionSettings } from 'shoutem.application';
import {
  consumeNotification,
  NotificationHandlers,
  queueNotification,
} from 'shoutem.firebase';
import { getNavInitialized } from 'shoutem.navigation';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { getStore } from 'shoutem.redux';
import { ext } from './const';
import { getNotificationSettings } from './redux';
import { getStateFromAsyncStorage, notifications } from './services';

// this extension handles only silent notifications
function canHandle(notification) {
  return notification.silent;
}

// handle local notification opens from push journeys
function canHandleJourneyNotification(notification) {
  return (
    !!notification.data?.triggerId &&
    notification.userInteraction &&
    !!notification.data?.action
  );
}

// handles local scheduled pushes. This handles both cases,
// when the queued notification becomes ready ( and triggers onNotificationTapped)
// and when the nav is ready and the notification can be processed right away
async function handleJourneyNotificationTapped(notification, dispatch) {
  if (!canHandleJourneyNotification(notification)) {
    return;
  }

  const store = getStore();

  // no store, meaning nav is not yet initialized
  if (!store) {
    dispatch(queueNotification(notification));
    return;
  }

  const navInitialized = getNavInitialized(store.getState());

  // store created, but nav is still not initialized
  if (!navInitialized) {
    dispatch(queueNotification(notification));
    return;
  }

  // store is ready. Consume notification
  dispatch(consumeNotification(resolveNotificationData(notification)));
}

function handleForegroundNotification(receivedNotification, store) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();
  const notificationSettings = getNotificationSettings(state);
  const scheduledNotificationsEnabled =
    getExtensionSettings(state, ext())?.scheduledNotificationsEnabled || false;

  if (
    scheduledNotificationsEnabled &&
    notificationSettings.dailyMessages &&
    notification.isMultiple
  ) {
    notifications.randomlyScheduleXnotifications(
      notification,
      notificationSettings,
    );
  }
}

export async function handleBackgroundNotification(receivedNotification) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  const state = await getStateFromAsyncStorage();
  const notificationSettings = getNotificationSettings(state);
  const { scheduledNotificationsEnabled } = getExtensionSettings(state, ext());

  if (
    scheduledNotificationsEnabled &&
    notificationSettings.dailyMessages &&
    notification.isMultiple
  ) {
    notifications.randomlyScheduleXnotifications(
      notification,
      notificationSettings,
    );
  }
}

export function registerNotificationHandlers(store) {
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationReceivedForeground: notification =>
        handleForegroundNotification(notification, store),
      onNotificationTapped: (notification, store) =>
        handleJourneyNotificationTapped(notification, store.dispatch),
    },
  });
}

export function registerBackgroundMessageHandler() {
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationReceivedBackground: notification =>
        handleBackgroundNotification(notification),
      onNotification: handleJourneyNotificationTapped,
    },
  });
}
