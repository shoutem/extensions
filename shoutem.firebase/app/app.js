import { Platform } from 'react-native';
import FCM, { FCMEvent } from 'react-native-fcm';

import { isProduction } from 'shoutem.application';
import { handleReceivedToken } from './services/fcm';
import { notificationReceived } from './actionCreators';

function resolveNotification(receivedNotification) {
  const {
    fcm,
    aps,
    opened_from_tray: openedFromTray,
  } = receivedNotification;

  if (!fcm && !aps) {
    return false;
  }

  if (fcm && fcm.body) {
    return {
      body: fcm.body,
      title: fcm.title,
      openedFromTray,
    };
  }

  if (receivedNotification && receivedNotification.body && receivedNotification.title) {
    return {
      body: receivedNotification.body,
      title: receivedNotification.title,
      openedFromTray,
    };
  }

  if (aps && aps.alert) {
    return {
      body: aps.alert.body,
      title: aps.alert.title,
      openedFromTray,
    };
  }

  return false;
}

function appDidFinishLaunching(app) {
  if (!isProduction()) {
    return;
  }

  const store = app.getStore();
  const { dispatch } = store;

  const dispatchNotificationAction = (receivedNotification) => {
    const {
      fcm,
      action,
      show_in_foreground,
    } = receivedNotification;

    const notification = resolveNotification(receivedNotification);

    if (!notification) {
      return;
    }

    if (fcm && show_in_foreground) {
      FCM.presentLocalNotification({
        body: notification.body,
        title: notification.title,
        ticker: notification.body,
        click_action: action,
        sound: "default",
        priority: "high",
        vibrate: 300,
        ongoing: false,
        auto_cancel: true,
        show_in_foreground: true,
      });
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

  // this shall be called regardless of app state: running, background or not
  // running. Previously would not be called when app is killed by user in iOS
  // but it seems that from firebase core 11.0.2. that is no longer the case
  FCM.on(FCMEvent.Notification, async (notif) => {
    if (notif) {
      dispatchNotificationAction({ ...notif });

      // iOS requires developers to call completionHandler to end the
      // notification process.
      // Otherwise, your background remote notifications could be throttled.
      // More info: https://developer.apple.com/documentation/uikit
      // /uiapplicationdelegate/1623013-application.
      if (Platform.OS === 'ios') {
        notif.finish();
      }
    }
  });

  // fcm token may not be available on the first load - catch it here
  FCM.on(FCMEvent.RefreshToken, (token) => {
    handleReceivedToken(token, dispatch);
  });

  FCM.getFCMToken().then((token) => {
    handleReceivedToken(token, dispatch);
  });

  // The initial notification contains the notification that launches the app.
  // If the user launches the app by clicking the banner, the banner
  // notification info will be here, rather than available through the FCM.on event.
  // Sometimes, Android kills activity when an app goes to
  // background, and when it resumes, Android broadcasts the notification before
  // JS is run.
  // You can use FCM.getInitialNotification() to capture those missed events.
  // The initial notification will be triggered every time, even when
  // the app is open via its icon, so send some action identifier with your
  // notifications

  FCM.getInitialNotification().then(notif => {
    if (notif) {
      dispatchNotificationAction({ ...notif, fromInit: true });
    }
  });
}

export {
  appDidFinishLaunching,
};
