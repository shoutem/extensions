import _ from 'lodash';
import { getNavInitialized } from 'shoutem.navigation';
import { queueNotification } from '../redux';

const APNSTokenReceivedHandlers = {};
const FCMTokenReceivedhandlers = {};
const notificationReceivedHandlers = {};

function collectHandlers(targetEvent) {
  return _.reduce(
    notificationReceivedHandlers,
    (result, handlers) => {
      const targetHandler = _.get(handlers, targetEvent);

      if (targetHandler) {
        result.push(targetHandler);
      }

      return result;
    },
    [],
  );
}

function registerAPNSTokenReceivedHandler(tokenHandler) {
  const extensionOwner = _.get(tokenHandler, 'owner');
  const handler = _.get(tokenHandler, 'onTokenReceived');

  if (extensionOwner && handler) {
    APNSTokenReceivedHandlers[extensionOwner] = handler;
  }
}

function registerFCMTokenReceivedHandler(tokenHandler) {
  const extensionOwner = _.get(tokenHandler, 'owner');
  const handler = _.get(tokenHandler, 'onTokenReceived');

  if (extensionOwner && handler) {
    FCMTokenReceivedhandlers[extensionOwner] = handler;
  }
}

function registerNotificationReceivedHandlers(notificationHandlers) {
  const extensionOwner = _.get(notificationHandlers, 'owner');
  const handlers = _.get(notificationHandlers, 'notificationHandlers');

  if (extensionOwner && handlers) {
    notificationReceivedHandlers[extensionOwner] = {
      ...notificationReceivedHandlers[extensionOwner],
      ...handlers,
    };
  }
}

export function handleFCMTokenReceived(token, dispatch) {
  _.forEach(FCMTokenReceivedhandlers, handler => handler(token, dispatch));
}

export function handleAPNSTokenReceived(token, dispatch) {
  _.forEach(APNSTokenReceivedHandlers, handler => handler(token, dispatch));
}

export function handleNotificationConsumed(notification, dispatch) {
  const mappedHandlers = collectHandlers('onConsumeNotification');

  _.forEach(mappedHandlers, handler => handler(notification, dispatch));
}

export function handleNotificationReceivedBackground(notification, dispatch) {
  const mappedHandlers = collectHandlers('onNotificationReceivedBackground');

  _.forEach(mappedHandlers, handler => handler(notification, dispatch));
}

export function handleNotificationReceivedForeground(notification, dispatch) {
  const mappedHandlers = collectHandlers('onNotificationReceivedForeground');

  _.forEach(mappedHandlers, handler => handler(notification, dispatch));
}

export function handleNotificationTapped(
  notification,
  store,
  navigationInitialized = false,
) {
  const state = store.getState();

  const navInitialized = getNavInitialized(state) || navigationInitialized;

  if (!navInitialized) {
    store.dispatch(queueNotification(notification));
    return;
  }

  const mappedHandlers = collectHandlers('onNotificationTapped');

  _.forEach(mappedHandlers, handler => handler(notification, store.dispatch));
}

export function handleNotification(notification, dispatch) {
  const mappedHandlers = collectHandlers('onNotification');

  _.forEach(mappedHandlers, handler => handler(notification, dispatch));
}

export function handlePendingNotification(notification, dispatch) {
  const mappedHandlers = collectHandlers('onPendingNotificationDispatched');

  _.forEach(mappedHandlers, handler => handler(notification, dispatch));
}

export default {
  registerAPNSTokenReceivedHandler,
  registerNotificationReceivedHandlers,
  registerFCMTokenReceivedHandler,
};
