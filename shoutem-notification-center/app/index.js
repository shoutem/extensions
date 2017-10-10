import NotificationDetailsScreen from './screens/NotificationDetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PushGroupsScreen from './screens/PushGroupsScreen';

import reducer, {
  middleware,
} from './redux';

const screens = {
  NotificationDetailsScreen,
  NotificationsScreen,
  PushGroupsScreen,
};

export {
  middleware,
  screens,
  reducer,
};

export { appDidMount } from './app';
