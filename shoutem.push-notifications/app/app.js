import { AppState, Alert } from 'react-native';
import _ from 'lodash';

import { getActiveShortcut } from 'shoutem.application';
import { NotificationHandlers, Firebase } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import {
  getNavigationInitialized,
  hasModalOpen,
  NAVIGATE,
  OPEN_MODAL,
} from 'shoutem.navigation';

import { ext, DEFAULT_PUSH_NOTIFICATION_GROUP } from './const';
import {
  displayPushNotificationMessage,
  getLastNotification,
  selectPushNotificationGroups,
  deviceTokenReceived,
  notificationReceived,
} from './redux';
import { resolveNotificationData } from './services';

function navigatesToSameShortcut(action, state) {
  const targetShortcutId = _.get(action, 'shortcutId');
  const { id: activeShortcutId } = getActiveShortcut(state);

  return targetShortcutId === activeShortcutId;
}

function resolveActionNavigation(action, state) {
  const alreadyHasModalOpen = hasModalOpen(state);

  // Actions that open screens have a navigationAction property which actions
  // that open URLs do not have.
  if (action.navigationAction && navigatesToSameShortcut(action, state)) {
    // If the notification points to the screen a user is already on, the
    // notification won't do anything. We safely catch this later in
    // dispatchNotification()
    return { ...action, navigationAction: null };
  }

  if (action.navigationAction === OPEN_MODAL && alreadyHasModalOpen) {
    return { ...action, navigationAction: NAVIGATE };
  }

  // Actions that open URLs have type set as 'shoutem.navigation.OPEN_MODAL',
  // this differs from actions that open screens which have a type property of
  // 'shoutem.navigation.EXECUTE_SHORTCUT'
  const actionType = _.get(action, 'type');
  if (actionType === OPEN_MODAL && alreadyHasModalOpen) {
    return { ...action, type: NAVIGATE };
  }

  return action;
}

export function dispatchNotification(receivedNotification, dispatch, store) {
  const action = _.get(receivedNotification, 'data.action') || _.get(receivedNotification, 'action');

  if (!action) {
    return;
  }

  const notification = resolveNotificationData(receivedNotification);

  if (!notification) {
    return;
  }

  try {
    const actionObject = JSON.parse(action);
    notification.action = resolveActionNavigation(actionObject, store.getState());
  } catch (e) {
    console.log('Unable to parse notification action object', e);
  }

  if (notification.title || notification.body) {
    dispatch(notificationReceived(notification));
  }
}

function handleAppStateChange(nextState) {
  if (nextState === 'active') {
    Firebase.clearBadge();
  }
}

function handleTokenReceived(token, dispatch) {
  dispatch(deviceTokenReceived(token));
  dispatch(selectPushNotificationGroups({
    added: [DEFAULT_PUSH_NOTIFICATION_GROUP],
  }));
}

function createLocalAlert(notification, dispatch, store) {
  const state = store.getState();
  const action = _.get(notification, 'data.action') || _.get(notification, 'action');
  const message = _.get(notification, 'data.text') || _.get(notification, 'message');

  if (!action && !message) {
    return;
  }

  const resolvedAction = action && resolveActionNavigation(JSON.parse(action), state);

  const viewAction = {
    text: I18n.t(ext('messageReceivedAlertView')),
    onPress: () => dispatch(resolvedAction),
  };
  const defaultAction = {
    text: I18n.t(ext('messageReceivedAlertDismiss')),
    onPress: () => { },
  };

  // If the notification has an action and the user is already on the screen
  // the action would navigate them to, we don't show the View action in the
  // alert, instead we only allow them to Dismiss the notification.
  const alertOptions =
    (action && !navigatesToSameShortcut(resolvedAction, state))
    ? [defaultAction, viewAction]
    : [defaultAction];

  Firebase.clearBadge();

  Alert.alert(
    I18n.t(ext('messageReceivedAlert')),
    message,
    alertOptions,
  );
}

const appDidMount = (app) => {
  Firebase.clearBadge();
  const store = app.getStore();

  NotificationHandlers.registerFCMTokenReceivedHandler({
    owner: ext(),
    onTokenReceived: handleTokenReceived,
  });
  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: (notification, dispatch) => dispatchNotification(notification, dispatch, store),
      onNotificationReceivedForeground: (notification, dispatch) => createLocalAlert(notification, dispatch, store),
      onNotificationReceivedBackground: (notification, dispatch) => dispatchNotification(notification, dispatch, store),
    },
  });

  AppState.addEventListener('change', handleAppStateChange);

  store.subscribe(() => {
    const state = store.getState();
    const isNavigationInitialized = getNavigationInitialized(state);
    const lastNotification = getLastNotification(state);

    if (
      lastNotification &&
      !!lastNotification.notificationContent &&
      isNavigationInitialized
    ) {
      store.dispatch(displayPushNotificationMessage(lastNotification.notificationContent));
    }
  });
};

const appWillUnmount = () => {
  AppState.removeEventListener('change', handleAppStateChange);
};

export {
  appDidMount,
  appWillUnmount,
};
