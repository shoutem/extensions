import i18next from 'i18next';
import _ from 'lodash';
import { AUDIENCE_TYPES, DELIVERY_TYPES, TARGET_TYPES } from '../const';
import LOCALIZATION from './localization';

function validateRequiredField(notification) {
  const { delivery, summary } = notification;

  if (delivery === DELIVERY_TYPES.USER_SCHEDULED) {
    return null;
  }

  if (!summary) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_TEXT);
  }

  return null;
}

function validateShortcut(notification) {
  const { delivery, shortcutId, target } = notification;

  if (
    !target ||
    target === TARGET_TYPES.URL ||
    target === TARGET_TYPES.APP ||
    delivery === DELIVERY_TYPES.USER_SCHEDULED
  ) {
    return null;
  }

  if (!shortcutId) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_TEXT);
  }

  return null;
}

function validateGroup(notification) {
  const { audienceGroupIds, audience } = notification;

  if (audience === AUDIENCE_TYPES.ALL) {
    return null;
  }

  if (!audienceGroupIds) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_TEXT);
  }

  return null;
}

function validateDelivery(notification) {
  const { deliveryTime, delivery } = notification;

  if (delivery === DELIVERY_TYPES.NOW) {
    return null;
  }

  if (!deliveryTime) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_TEXT);
  }

  return null;
}

function validateNumber(notification) {
  const { delivery, numberOfMessages, summaries } = notification;

  if (delivery !== DELIVERY_TYPES.USER_SCHEDULED) {
    return null;
  }

  const summariesEntered = _.filter(summaries, summary => summary !== '');

  if (
    !numberOfMessages ||
    numberOfMessages < 1 ||
    numberOfMessages > summariesEntered.length
  ) {
    return i18next.t(LOCALIZATION.NUMBER_NOT_IN_RANGE_TEXT);
  }

  return null;
}

export function validateNotification(notification) {
  return {
    summary: validateRequiredField(notification),
    shortcutId: validateShortcut(notification),
    audienceGroupIds: validateGroup(notification),
    deliveryTime: validateDelivery(notification),
    numberOfMessages: validateNumber(notification),
  };
}
