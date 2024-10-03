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
import { middleware, reducer } from './redux';

const MOCKED_SAVE_JOURNEY = 'MOCKED_SAVE_JOURNEY';
const MOCKED_CANCEL_JOURNEY = 'MOCKED_CANCEL_JOURNEY';

function triggerOccured() {
  return { type: MOCKED_SAVE_JOURNEY };
}

function triggerCanceled() {
  return { type: MOCKED_CANCEL_JOURNEY };
}

function cancelPendingJourney() {
  return { type: MOCKED_CANCEL_JOURNEY };
}

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

export {
  cancelPendingJourney,
  middleware,
  reducer,
  screens,
  triggerCanceled,
  triggerOccured,
};

export { appDidMount } from './app';
