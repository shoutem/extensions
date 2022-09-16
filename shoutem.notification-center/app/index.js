import NotificationDailySettingsScreen from './screens/NotificationDailySettingsScreen';
import NotificationDetailsScreen from './screens/NotificationDetailsScreen';
import NotificationSettingsScreen from './screens/NotificationSettingsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PushGroupsScreen from './screens/PushGroupsScreen';
import ReminderSettingsScreen from './screens/ReminderSettingsScreen';
import enTranslations from './translations/en.json';
import { registerBackgroundMessageHandler } from './notificationHandlers';
import { middleware, reducer, triggerCanceled, triggerOccured, cancelPendingJourney } from './redux';

// Android only. Handles push notifications when the app is killed.
// Has to be defined outside app lifecycle
registerBackgroundMessageHandler();

const screens = {
  NotificationDailySettingsScreen,
  NotificationDetailsScreen,
  NotificationSettingsScreen,
  NotificationsScreen,
  PushGroupsScreen,
  ReminderSettingsScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export { notificationJourneys } from './services';

export { middleware, reducer, screens, triggerCanceled, triggerOccured, cancelPendingJourney };

export { appDidMount } from './app';
