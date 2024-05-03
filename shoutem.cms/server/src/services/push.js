import _ from 'lodash';
import { NOTIFICATION_CAPABILITIES } from '../const';

export function isPushNotificationModuleEnabled(modules) {
  return !!_.find(modules, { name: 'pushNotifications' });
}

export function canSendPush(shortcut, modules) {
  const moduleEnabled = isPushNotificationModuleEnabled(modules);

  return (
    moduleEnabled &&
    _.includes(shortcut.capabilities, NOTIFICATION_CAPABILITIES.PUSH)
  );
}

export function canSendInAppPush(shortcut, modules) {
  const moduleEnabled = isPushNotificationModuleEnabled(modules);

  return (
    moduleEnabled &&
    _.includes(shortcut.capabilities, NOTIFICATION_CAPABILITIES.IN_APP_PUSH)
  );
}
