import { combineReducers } from 'redux';
import {
  notificationsReducer,
  notificationSettingsReducer,
} from './notifications';

import {
  deviceToken,
  groups,
  manuallyUnsubscribedGroups,
  middleware,
  selectedGroups,
} from './groups';

export {
  NOTIFICATIONS_SCHEMA,
  fetchNotifications,
  getDailyMessagesAppSettings,
  getNotificationSettings,
  getReminderAppSettings,
  invalidateNotifications,
  markAsRead,
  setNotificationSettings,
  viewNotification,
} from './notifications';

export {
  GROUPS_SCHEMA,
  SELECTED_GROUPS_SCHEMA,
  fetchGroups,
  fetchSelectedGroups,
} from './groups';

export { middleware };

export default combineReducers({
  deviceToken,
  notifications: notificationsReducer(),
  notificationSettings: notificationSettingsReducer,
  groups,
  manuallyUnsubscribedGroups,
  selectedGroups,
});
