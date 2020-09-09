import _ from 'lodash';

let tokenReceivedHandlers = {};
let fcmTokenReceivedhandlers = {};
let notificationReceivedHandlers = {};

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

function registerTokenReceivedHandler(tokenHandler) {
  const extensionOwner = _.get(tokenHandler, 'owner');
  const handler = _.get(tokenHandler, 'onTokenReceived');

  if (extensionOwner && handler) {
    tokenReceivedHandlers[extensionOwner] = handler;
  }
}

function registerFCMTokenReceivedHandler(tokenHandler) {
  const extensionOwner = _.get(tokenHandler, 'owner');
  const handler = _.get(tokenHandler, 'onTokenReceived');

  if (extensionOwner && handler) {
    fcmTokenReceivedhandlers[extensionOwner] = handler;
  }
}

function registerNotificationReceivedHandlers(notificationHandlers) {
  const extensionOwner = _.get(notificationHandlers, 'owner');
  const handlers = _.get(notificationHandlers, 'notificationHandlers');

  if (extensionOwner && handlers) {
    notificationReceivedHandlers[extensionOwner] = handlers;
  }
}

function removeTokenReceivedHandler(owner) {
  if (tokenReceivedHandlers[owner]) {
    _.omit(tokenReceivedHandlers, owner);
  }
}

export function handleFCMTokenReceived(token, dispatch) {
  _.forEach(fcmTokenReceivedhandlers, (handler) => handler(token, dispatch));
}

export function handleReceivedToken(token, dispatch) {
  _.forEach(tokenReceivedHandlers, (handler) => handler(token.token, dispatch));
}

export function handleNotificationReceivedBackground(notification, dispatch) {
  const mappedHandlers = collectHandlers('onNotificationReceivedBackground');

  _.forEach(mappedHandlers, (handler) => handler(notification, dispatch));
}

export function handleNotificationReceivedForeground(notification, dispatch) {
  const mappedHandlers = collectHandlers('onNotificationReceivedForeground');

  _.forEach(mappedHandlers, (handler) => handler(notification, dispatch));
}

export function handleNotificationTapped(notification, dispatch) {
  const mappedHandlers = collectHandlers('onNotificationTapped');

  _.forEach(mappedHandlers, (handler) => handler(notification, dispatch));
}

export function handlePendingNotification(notification, dispatch) {
  const mappedHandlers = collectHandlers('onPendingNotificationDispatched');

  _.forEach(mappedHandlers, (handler) => handler(notification, dispatch));
}

export default {
  registerTokenReceivedHandler,
  registerNotificationReceivedHandlers,
  registerFCMTokenReceivedHandler,
  removeTokenReceivedHandler,
};
