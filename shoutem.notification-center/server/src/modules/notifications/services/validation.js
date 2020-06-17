import { TARGET_TYPES, AUDIENCE_TYPES, DELIVERY_TYPES } from '../const';

const VALUE_REQUIRED = 'Value is required';

function validateRequiredField(fieldValue) {
  if (!fieldValue) {
    return VALUE_REQUIRED;
  }

  return null;
}

function validateShortcut(notification) {
  const { shortcutId, target } = notification;

  if (target === TARGET_TYPES.URL) {
    return null;
  }

  if (!shortcutId) {
    return VALUE_REQUIRED;
  }

  return null;
}

function validateGroup(notification) {
  const { audienceGroupIds, audience } = notification;

  if (audience === AUDIENCE_TYPES.ALL) {
    return null;
  }

  if (!audienceGroupIds) {
    return VALUE_REQUIRED;
  }

  return null;
}

function validateDelivery(notification) {
  const { deliveryTime, delivery } = notification;

  if (delivery === DELIVERY_TYPES.NOW) {
    return null;
  }

  if (!deliveryTime) {
    return VALUE_REQUIRED;
  }

  return null;
}

export function validateNotification(notification) {
  const { summary } = notification;

  return {
    summary: validateRequiredField(summary),
    shortcutId: validateShortcut(notification),
    audienceGroupIds: validateGroup(notification),
    deliveryTime: validateDelivery(notification),
  };
}
