import _ from 'lodash';

import { Alert } from 'react-native';

import { SHOW_PUSH_NOTIFICATION } from './redux';

import FCM from 'react-native-fcm';

import { I18n } from 'shoutem.i18n';

// eslint-disable-next-line no-unused-vars
const showNotification = store => next => action => {  
  if (action.type === SHOW_PUSH_NOTIFICATION) {
    notificationContent = action.payload.notification;
    
    function onNotificationAction(notificationContent) {
      const action = _.get(notificationContent, 'action');
    
      if (!!action) {
        store.dispatch(action);
      }
    }
    
    if (notificationContent.openedFromTray) {
      return onNotificationAction(notificationContent);
    }
    
    Alert.alert(
      I18n.t(ext('messageReceivedAlert')),
      notificationContent.body,
      [
        { text: I18n.t(ext('messageReceivedAlertView')), onPress: onNotificationAction.bind(null, notificationContent) },
        { text: I18n.t(ext('messageReceivedAlertDismiss')), onPress: () => {} },
      ]
    );
  }

  return next(action);
};

export default [showNotification];
