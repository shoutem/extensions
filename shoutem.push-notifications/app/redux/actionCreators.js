import { Firebase } from 'shoutem.firebase';
import {
  DEVICE_TOKEN_RECEIVED,
  SELECT_PUSH_NOTIFICATION_GROUPS,
} from './actionTypes';

/**
 * @see SELECT_PUSH_NOTIFICATION_GROUPS
 * Used for triggering push notification group subscription
 * @param added - notification groups which need to be added to subscribed groups
 * @param removed - notification groups which need to be removed from subscribed groups
 * @returns {{type: String, payload: {added: [], removed: []}}}
 */
export function selectPushNotificationGroups({ added, removed }) {
  Firebase.selectGroups({ added, removed });
  return {
    type: SELECT_PUSH_NOTIFICATION_GROUPS,
    payload: {
      added,
      removed,
    },
  };
}

export function deviceTokenReceived(token) {
  return {
    type: DEVICE_TOKEN_RECEIVED,
    token,
  };
}
