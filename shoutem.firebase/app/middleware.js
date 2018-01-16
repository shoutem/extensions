import {
  SELECT_PUSH_NOTIFICATION_GROUPS,
  REQUEST_PUSH_PERMISSION,
  USER_NOTIFIED,
} from 'shoutem.push-notifications';
import { isProduction } from 'shoutem.application';

import FCM from 'react-native-fcm';

// eslint-disable-next-line no-unused-vars
const requestPermissions = store => next => action => {
  if (isProduction()) {
    if (action.type === REQUEST_PUSH_PERMISSION) {
      FCM.requestPermissions();
    }
  }

  return next(action);
};

// eslint-disable-next-line no-unused-vars
const selectGroups = store => next => action => {
  if (isProduction()) {
    if (action.type === SELECT_PUSH_NOTIFICATION_GROUPS && !!action.payload) {
      const {added = [], removed = []} = action.payload;

      added.filter(Boolean).map((group) => `/topics/${group}`).forEach(FCM.subscribeToTopic);
      removed.filter(Boolean).map((group) => `/topics/${group}`).forEach(FCM.unsubscribeFromTopic);
    }
  }

  return next(action);
};

// eslint-disable-next-line no-unused-vars
const clearBadge = store => next => action => {
  if (isProduction()) {
    if (action.type === USER_NOTIFIED) {
      FCM.setBadgeNumber(0);
    }
  }

  return next(action);
};

export default [requestPermissions, selectGroups, clearBadge];
