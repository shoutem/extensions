import CreatePushNotificationScreen from './screens/CreatePushNotificationScreen';
import EditPushNotificationScreen from './screens/EditPushNotificationScreen';
import NotificationDailySettingsScreen from './screens/NotificationDailySettingsScreen';
import NotificationDetailsScreen from './screens/NotificationDetailsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PushGroupsScreen from './screens/PushGroupsScreen';
import PushNotificationsScreen from './screens/PushNotificationsScreen';
import ReminderSettingsScreen from './screens/ReminderSettingsScreen';
import ViewPushNotificationScreen from './screens/ViewPushNotificationScreen';
import enTranslations from './translations/en.json';
import { registerBackgroundMessageHandler } from './notificationHandlers';
import {
  cancelPendingJourney,
  middleware,
  reducer,
  triggerCanceled,
  triggerOccured,
} from './redux';

// Registers notification handlers for when app is in background or quit state.
// Handles user scheduled - silent push notifications only.
// If all conditions are met, will randomly schedule X local notifications.
registerBackgroundMessageHandler();

const screens = {
  NotificationDailySettingsScreen,
  NotificationDetailsScreen,
  NotificationSettingsScreen,
  NotificationsScreen,
  PushGroupsScreen,
  ReminderSettingsScreen,
  CreatePushNotificationScreen,
  EditPushNotificationScreen,
  PushNotificationsScreen,
  ViewPushNotificationScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { notificationJourneys } from './services';

export {
  cancelPendingJourney,
  middleware,
  reducer,
  screens,
  triggerCanceled,
  triggerOccured,
};

export { appDidMount, appWillMount } from './app';
