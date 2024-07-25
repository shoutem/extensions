import { getExtensionSettings } from 'shoutem.application';
import {
  consumeNotification,
  NotificationHandlers,
  queueNotification,
} from 'shoutem.firebase';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { getStore } from 'shoutem.redux';
import { ext } from './const';
import { getNotificationSettings } from './redux';
import { getStateFromAsyncStorage, notifications } from './services';

function canHandle(notification) {
  return notification.silent;
}

function canHandleJourneyNotification(notification) {
  return (
    !!notification.data?.triggerId &&
    notification.userInteraction &&
    !!notification.data?.action
  );
}

// If tapped notification is journey notification, all onConsumeNotification handlers
// will process it. It should only be fully handled in shoutem.push-notifications onConsumeNotification handler.
// On Android, notification is sometimes processed before store or navigation have been initialized, so we have
// to queue notification for later consumption.
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

// This extension handles:
// - Receiving User scheduled notifications, silent push notifications. After received, app will randomly schedule
//   X number of local notifications with only title & body. Tapping that notification later is processed in
//  shoutem.push-notifications' onConsumeNotification handler.
// - Tapping Journey scheduled notifications, local notifications. After tapped, notification is processed in
//  shoutem.push-notifications' onConsumeNotification handler.
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
    },
  });
}
