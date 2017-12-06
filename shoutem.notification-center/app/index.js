import NotificationDetailsScreen from './screens/NotificationDetailsScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import PushGroupsScreen from './screens/PushGroupsScreen';

import reducer, {
  middleware,
} from './redux';

import enTranslations from './translations/en.json';

const screens = {
  NotificationDetailsScreen,
  NotificationsScreen,
  PushGroupsScreen,
};

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export {
  middleware,
  screens,
  reducer,
};

export { appDidMount } from './app';
