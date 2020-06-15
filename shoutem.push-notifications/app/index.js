import {
  reducer,
  selectPushNotificationGroups,
  NOTIFICATION_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  USER_NOTIFIED,
  DEVICE_TOKEN_RECEIVED,
  SHOW_PUSH_NOTIFICATION,
} from './redux';

import { appDidMount, appWillMount, appWillUnmount } from './app';
import Permissions from './permissions';
import enTranslations from './translations/en.json';
import { showInitialNotification, showNotification } from './middleware';
export { resolveNotificationData } from './services';

export { DEFAULT_PUSH_NOTIFICATION_GROUP } from './const';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export const middleware = [
  showInitialNotification,
  showNotification,
];

export {
  reducer,
  selectPushNotificationGroups,
  NOTIFICATION_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  USER_NOTIFIED,
  DEVICE_TOKEN_RECEIVED,
  appDidMount,
  appWillMount,
  appWillUnmount,
  Permissions,
  SHOW_PUSH_NOTIFICATION,
};
