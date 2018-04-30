import { isURL } from 'validator';
import _ from 'lodash';
import moment from 'moment';
import { isExpirationTimeValid } from './deal';

function validateRequiredField(fieldValue) {
  if (!fieldValue) {
    return 'Value is required';
  }

  return null;
}

function validateExpirationTime(expirationTime) {
  if (!expirationTime) {
    return 'Value is required';
  }

  if (!isExpirationTimeValid(expirationTime)) {
    return 'Invalid value provided';
  }

  return null;
}

function validateNumericField(fieldValue) {
  const numberValue = _.toNumber(fieldValue);

  if (_.isNaN(numberValue)) {
    return 'Value must be numeric';
  }

  return null;
}

function validateUrl(urlField) {
  if (urlField && !isURL(urlField)) {
    return 'Invalid URL provided';
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
      startTime: 'Start time must be before end time',
      endTime: 'End time must be after start time',
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
    regularPrice: (
      validateRequiredField(regularPrice) ||
      validateNumericField(regularPrice)
    ),
    discountPrice: (
      validateRequiredField(discountPrice) ||
      validateNumericField(discountPrice)
    ),
    discountType: validateRequiredField(discountType),
    currency: validateRequiredField(currency),
    couponsExpirationTime: (
      couponsEnabled &&
      validateExpirationTime(couponsExpirationTime)
    ),
    buyLink: validateUrl(buyLink),
    ...validateStartEndTime(startTime, endTime),
  };
}
