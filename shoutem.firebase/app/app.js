import { Platform } from 'react-native';
import FCM, { FCMEvent } from 'react-native-fcm';

import { isProduction } from 'shoutem.application';

import {
  handleReceivedToken,
} from './services/fcm';

import { notificationReceived } from './actionCreators';

function appDidMount(app) {
  if (!isProduction()) {
    return;
  }

  const store = app.getStore();

  const { dispatch } = store;
  
  const dispatchNotificationAction = (receivedNotification) => {    
    if (receivedNotification.fcm) {
      var { fcm, action, opened_from_tray, show_in_foreground } = receivedNotification;
      var notification = { body: fcm.body, openedFromTray: opened_from_tray, title: fcm.title };
      
      if (show_in_foreground) {
        FCM.presentLocalNotification({
            title: notification.title,
            body: notification.body,
            sound: "default",
            priority: "high",
            click_action: action,
            ticker: notification.body,
            auto_cancel: true,
            vibrate: 300,
            ongoing: false,
            show_in_foreground: true
        });
      }
    } else if (receivedNotification.aps) {
      var { aps, action, opened_from_tray } = receivedNotification;
      var notification = { body: aps.alert, openedFromTray: opened_from_tray, title: receivedNotification['google.c.a.c_l'] };
    } else {
      return;
    }
    
    if (action) {
      try {
        const actionObject = JSON.parse(action);
        notification.action = actionObject;
      } catch (e) {
        console.log('Unable to parse notification action object', e);
      }
    }

    dispatch(notificationReceived(notification));
  };

  // this shall be called regardless of app state: running, background or not running. Won't be called when app is killed by user in iOS
  FCM.on(FCMEvent.Notification, async (notif) => {      
      if (notif) {
        dispatchNotificationAction({ ...notif });
        
        // iOS requires developers to call completionHandler to end notification process. If you do not call it your background remote notifications could be throttled, to read more about it see https://developer.apple.com/documentation/uikit/uiapplicationdelegate/1623013-application.
        if (Platform.OS === 'ios') {
          notif.finish();
        }
      }
  });
  
  FCM.on(FCMEvent.RefreshToken, (token) => {
    // fcm token may not be available on first load, catch it here
    handleReceivedToken(token, dispatch);
  });

  FCM.getFCMToken().then((token) => {
    handleReceivedToken(token, dispatch);
  });
  
  // initial notification contains the notification that launchs the app. If user launchs app by clicking banner, the banner notification info will be here rather than through FCM.on event
  // sometimes Android kills activity when app goes to background, and when resume it broadcasts notification before JS is run. You can use FCM.getInitialNotification() to capture those missed events.
  // initial notification will be triggered all the time even when open app by icon so send some action identifier when you send notification
  FCM.getInitialNotification().then(notif => {    
    if (notif) {
      dispatchNotificationAction({ ...notif });
    }
  });
}

export {
  appDidMount,
};
