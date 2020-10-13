import {
  reducer,
  selectPushNotificationGroups,
  NOTIFICATION_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  USER_NOTIFIED,
  DEVICE_TOKEN_RECEIVED,
  SHOW_PUSH_NOTIFICATION,
  clearPendingNotification,
  setPendingNotification,
} from './redux';

import { appDidMount, appWillMount, appWillUnmount } from './app';
import enTranslations from './translations/en.json';
import {
  showInitialNotification,
  showNotification,
  pendingNotificationMiddleware,
} from './redux/middleware';
export { resolveNotificationData } from './services';

export { DEFAULT_PUSH_NOTIFICATION_GROUP, ext } from './const';

export { displayLocalNotification } from './notificationHandlers';

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
  pendingNotificationMiddleware,
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
  SHOW_PUSH_NOTIFICATION,
  clearPendingNotification,
  setPendingNotification,
};
