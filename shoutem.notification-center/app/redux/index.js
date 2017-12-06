import { combineReducers } from 'redux';

import notificationsReducer from './notifications';

import {
  deviceToken,
  groups,
  manuallyUnsubscribedGroups,
  middleware,
  selectedGroups,
} from './groups';

export {
  NOTIFICATIONS_SCHEMA,
  markAsRead,
  fetchNotifications,
  invalidateNotifications,
} from './notifications';

export {
  GROUPS_SCHEMA,
  SELECTED_GROUPS_SCHEMA,
  fetchGroups,
  fetchSelectedGroups,
  selectPushNotificationGroups,
} from './groups';

export { middleware };

export default combineReducers({
  deviceToken,
  notifications: notificationsReducer(),
  groups,
  manuallyUnsubscribedGroups,
  selectedGroups,
});
