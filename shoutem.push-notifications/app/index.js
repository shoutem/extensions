import {
  reducer,
  selectPushNotificationGroups,
  NOTIFICATION_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  USER_NOTIFIED,
  REQUEST_PUSH_PERMISSION,
  DEVICE_TOKEN_RECEIVED,
} from './redux';

import { appDidMount, appWillMount, appWillUnmount } from './app';

import Permissions from './permissions';

import enTranslations from './translations/en.json';

export const DEFAULT_PUSH_NOTIFICATION_GROUP = 'broadcast';

export const shoutem = {
  i18n: {
    translations: {
      en: enTranslations,
    },
  },
};

export {
  reducer,
  selectPushNotificationGroups,
  NOTIFICATION_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
  USER_NOTIFIED,
  REQUEST_PUSH_PERMISSION,
  DEVICE_TOKEN_RECEIVED,
  appDidMount,
  appWillMount,
  appWillUnmount,
  Permissions,
};
