import { getExtensionSettings } from 'shoutem.application';
import { NotificationHandlers } from 'shoutem.firebase';
import { resolveNotificationData } from 'shoutem.push-notifications';
import { ext } from './const';
import { getNotificationSettings } from './redux/notifications';
import { getStateFromAsyncStorage, notifications } from './services';

// this extension handles only silent notifications
function canHandle(notification) {
  return notification.silent;
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
  const scheduledNotificationsEnabled = getExtensionSettings(state, ext())
    .scheduledNotificationsEnabled;

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
