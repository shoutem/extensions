import { isURL } from 'validator';
import _ from 'lodash';
import moment from 'moment';
import i18next from 'i18next';
import { isExpirationTimeValid } from './deal';
import LOCALIZATION from './localization';

function validateRequiredField(fieldValue) {
  if (!fieldValue) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_MESSAGE);
  }

  return null;
}

function validateExpirationTime(expirationTime) {
  if (!expirationTime) {
    return i18next.t(LOCALIZATION.VALUE_REQUIRED_MESSAGE);
  }

  if (!isExpirationTimeValid(expirationTime)) {
    return i18next.t(LOCALIZATION.INVALID_VALUE_MESSAGE);
  }

  return null;
}

function validateNumericField(fieldValue) {
  const numberValue = _.toNumber(fieldValue);

  if (_.isNaN(numberValue)) {
    return i18next.t(LOCALIZATION.INVALID_NUMBER_MESSAGE);
  }

  return null;
}

function validateUrl(urlField) {
  if (urlField && !isURL(urlField)) {
    return i18next.t(LOCALIZATION.INVALID_URL_MESSAGE);
  }

  return null;
}

function validateStartEndTime(startTime, endTime) {
  if (!startTime || !endTime) {
    return {
      startTime: validateRequiredField(startTime),
      endTime: validateRequiredField(endTime),
    };
  }

  const momentStartTime = moment(startTime);
  const momentEndTime = moment(endTime);

  if (!momentStartTime.isBefore(momentEndTime)) {
    return {
      startTime: i18next.t(LOCALIZATION.INVALID_START_TIME_MESSAGE),
      endTime: i18next.t(LOCALIZATION.INVALID_END_TIME_MESSAGE),
    };
  }

  return {};
}

export function validateDeal(deal) {
  const {
    title,
    regularPrice,
    discountPrice,
    currency,
    discountType,
    startTime,
    endTime,
    couponsExpirationTime,
    couponsEnabled,
    buyLink,
  } = deal;

  return {
    title: validateRequiredField(title),
    regularPrice:
      validateRequiredField(regularPrice) || validateNumericField(regularPrice),
    discountPrice:
      validateRequiredField(discountPrice) ||
      validateNumericField(discountPrice),
    discountType: validateRequiredField(discountType),
    currency: validateRequiredField(currency),
    couponsExpirationTime:
      couponsEnabled && validateExpirationTime(couponsExpirationTime),
    buyLink: validateUrl(buyLink),
    ...validateStartEndTime(startTime, endTime),
  };
}
