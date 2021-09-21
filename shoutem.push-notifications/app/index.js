import {
  selectPushNotificationGroups,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  DEVICE_TOKEN_RECEIVED,
} from './redux';

import { appDidMount, appWillMount, appWillUnmount } from './app';
import enTranslations from './translations/en.json';
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

export {
  selectPushNotificationGroups,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  DEVICE_TOKEN_RECEIVED,
  appDidMount,
  appWillMount,
  appWillUnmount,
};
