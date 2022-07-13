import enTranslations from './translations/en.json';
import { appDidMount, appWillMount, appWillUnmount } from './app';
import {
  DEVICE_TOKEN_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  selectPushNotificationGroups,
} from './redux';

export { DEFAULT_PUSH_NOTIFICATION_GROUP, ext } from './const';
export { displayLocalNotification } from './notificationHandlers';
export { resolveNotificationData } from './services';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export {
  appDidMount,
  appWillMount,
  appWillUnmount,
  DEVICE_TOKEN_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  selectPushNotificationGroups,
};
