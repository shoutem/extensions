import { Alert } from 'react-native';
import _ from 'lodash';
import { getActiveShortcut } from 'shoutem.application';
import { NotificationHandlers } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { hasModalOpen, NAVIGATE, OPEN_MODAL } from 'shoutem.navigation';
import { ext, DEFAULT_PUSH_NOTIFICATION_GROUP } from './const';
import {
  selectPushNotificationGroups,
  deviceTokenReceived,
  notificationReceived,
} from './redux';
import { resolveNotificationData } from './services';

function isRssPN(notification) {
  // For now, only rss specific push notifications contain
  // itemSchema property, old notifications don't
  return !_.isEmpty(_.get(notification, 'itemSchema'));
}

function canHandle(notification) {
  return (
    !isRssPN(notification) &&
    (!!notification.action || (!!notification.action && !!notification.body))
  );
}

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
    // handleNotificationTapped()
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

function handleTokenReceived(token, dispatch) {
  dispatch(deviceTokenReceived(token));
  dispatch(
    selectPushNotificationGroups({
      added: [DEFAULT_PUSH_NOTIFICATION_GROUP],
    }),
  );
}

function handleViewButtonPress(store, navigationAction) {
  const state = store.getState();
  const { dispatch } = store;
  const alreadyHasModalOpen = hasModalOpen(state);

  navigationAction.type = alreadyHasModalOpen ? NAVIGATE : OPEN_MODAL;

  dispatch(navigationAction);
}

export function displayLocalNotification(
  title,
  message,
  navigationAction,
  store,
) {
  const state = store.getState();

  const viewAction = {
    text: I18n.t(ext('messageReceivedAlertView')),
    onPress: () => handleViewButtonPress(store, navigationAction),
  };

  const defaultAction = {
    text: I18n.t(ext('messageReceivedAlertDismiss')),
    onPress: () => null,
  };

  // If the notification has an action and the user is already on the screen
  // the action would navigate them to, we don't show the View action in the
  // alert, instead we only allow them to Dismiss the notification.
  const alertOptions =
    navigationAction && !navigatesToSameShortcut(navigationAction, state)
      ? [defaultAction, viewAction]
      : [defaultAction];

  Alert.alert(title, message, alertOptions);
}

function handleNotificationTapped(receivedNotification, dispatch, store) {
  // TODO: Improve handlers logic with queue, priorities, shouldHandle
  // and isConsumed flags
  // https://fiveminutes.jira.com/browse/SEEXT-8463
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  try {
    notification.action = resolveActionNavigation(
      notification.action,
      store.getState(),
    );
  } catch (e) {
    console.log('Unable to parse notification action object', e);
  }

  if (notification.title || notification.body) {
    dispatch(notificationReceived(notification));
  }
}

function handleForegroundNotification(receivedNotification, dispatch, store) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();
  const title = I18n.t(ext('messageReceivedAlert'));
  const resolvedAction =
    notification.action && resolveActionNavigation(notification.action, state);

  displayLocalNotification(title, notification.body, resolvedAction, store);
}

export function registerNotificationHandlers(store) {
  NotificationHandlers.registerFCMTokenReceivedHandler({
    owner: ext(),
    onTokenReceived: handleTokenReceived,
  });

  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: (notification, dispatch) =>
        handleNotificationTapped(notification, dispatch, store),
      onNotificationReceivedForeground: (notification, dispatch) =>
        handleForegroundNotification(notification, dispatch, store),
    },
  });
}
