import { Alert } from 'react-native';
import _ from 'lodash';
import { getShortcut } from 'shoutem.application';
import { NotificationHandlers } from 'shoutem.firebase';
import { I18n } from 'shoutem.i18n';
import { getCurrentRoute, openInModal } from 'shoutem.navigation';
import { DEFAULT_PUSH_NOTIFICATION_GROUP, ext } from './const';
import { deviceTokenReceived, selectPushNotificationGroups } from './redux';
import { resolveNotificationData } from './services';

const OPEN_IN_MODAL_ACTION_TYPE = 'shoutem.navigation.OPEN_MODAL';
const NAVIGATE_ACTION_TYPE = 'shoutem.application.EXECUTE_SHORTCUT';

function isRssPN(notification) {
  // For now, only rss specific push notifications contain
  // itemSchema property, old notifications don't
  return !_.isEmpty(_.get(notification, 'itemSchema'));
}

function canHandle(notification) {
  return (
    !notification.silent &&
    !isRssPN(notification) &&
    (!!notification.action || (!!notification.action && !!notification.body))
  );
}

function navigatesToSameShortcut(action) {
  const currentRoute = getCurrentRoute();
  const currentRouteShortcut = _.get(currentRoute, 'params.shortcut');

  if (!currentRouteShortcut) {
    return false;
  }

  const targetShortcutId = _.get(action, 'shortcutId');

  return currentRouteShortcut.id === targetShortcutId;
}

function consumeNotification(notificationContent, state) {
  const action = _.get(notificationContent, 'action');

  if (!canHandle(notificationContent)) {
    return null;
  }

  const { type } = action;

  if (type === NAVIGATE_ACTION_TYPE && !navigatesToSameShortcut(action)) {
    const shortcutId = _.get(action, 'shortcutId');
    const shortcut = getShortcut(state, shortcutId);
    const screenSettings = _.get(
      _.find(shortcut.screens, { canonicalName: shortcut.screen }),
      'screenSettings',
      {},
    );

    if (shortcut && shortcut.screen) {
      return openInModal(shortcut.screen, {
        shortcut,
        screenSettings,
        title: shortcut.title,
        screenId: _.uniqueId(shortcut.screen),
      });
    }
  }

  if (type === OPEN_IN_MODAL_ACTION_TYPE) {
    const { route } = action;
    const { screen, props } = route;

    return openInModal(screen, props);
  }

  return null;
}

function handleTokenReceived(token, dispatch) {
  dispatch(deviceTokenReceived(token));
  dispatch(
    selectPushNotificationGroups({
      added: [DEFAULT_PUSH_NOTIFICATION_GROUP],
    }),
  );
}

export function displayLocalNotification(title, message, notification, store) {
  const viewAction = {
    text: I18n.t(ext('messageReceivedAlertView')),
    onPress: () => consumeNotification(notification, store.getState()),
  };

  const defaultAction = {
    text: I18n.t(ext('messageReceivedAlertDismiss')),
    onPress: () => null,
  };

  const action = _.get(notification, 'action');
  const alertOptions =
    action && !navigatesToSameShortcut(action)
      ? [defaultAction, viewAction]
      : [defaultAction];

  Alert.alert(title, message, alertOptions);
}

function handleNotificationTapped(receivedNotification, store) {
  // TODO: Improve handlers logic with queue, priorities, shouldHandle
  // and isConsumed flags
  // https://fiveminutes.jira.com/browse/SEEXT-8463
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  const state = store.getState();

  consumeNotification(notification, state);
}

function handleForegroundNotification(receivedNotification, store) {
  const notification = resolveNotificationData(receivedNotification);

  if (!canHandle(notification)) {
    return;
  }

  const title = I18n.t(ext('messageReceivedAlert'));

  displayLocalNotification(title, notification.body, notification, store);
}

export function registerNotificationHandlers(store) {
  NotificationHandlers.registerFCMTokenReceivedHandler({
    owner: ext(),
    onTokenReceived: handleTokenReceived,
  });

  NotificationHandlers.registerNotificationReceivedHandlers({
    owner: ext(),
    notificationHandlers: {
      onNotificationTapped: notification =>
        handleNotificationTapped(notification, store),
      onNotificationReceivedForeground: notification =>
        handleForegroundNotification(notification, store),
      onConsumeNotification: notification =>
        consumeNotification(notification, store.getState()),
    },
  });
}
