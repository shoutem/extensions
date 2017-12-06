import {
  DEFAULT_PUSH_NOTIFICATION_GROUP,
  selectPushNotificationGroups,
} from 'shoutem.push-notifications';

import { deviceTokenReceived } from '../actionCreators';

export const handleReceivedToken = (token, dispatch) => {
  dispatch(deviceTokenReceived(token));
  // Display the FCM token only in development mode
  if (process.env.NODE_ENV === 'development') {
    console.log('Firebase device token:', token);
  }

  dispatch(selectPushNotificationGroups({
    added: [DEFAULT_PUSH_NOTIFICATION_GROUP],
  }));
};
