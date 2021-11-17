import { isURL } from 'validator';
import _ from 'lodash';
import moment from 'moment';
import i18next from 'i18next';
import { DEFAULT_START_TIME } from '../const';
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

function validateNumericFields(regularPrice, discountPrice) {
  const validation = {};

  if (!!regularPrice) {
    validation.regularPrice = validateNumericField(regularPrice);
  }

  if (!!discountPrice) {
    validation.discountPrice = validateNumericField(discountPrice);
  }

  return validation;
}

function validateUrl(urlField) {
  if (urlField && !isURL(urlField)) {
    return i18next.t(LOCALIZATION.INVALID_URL_MESSAGE);
  }

  return null;
}

function validatePricing(regularPrice, discountPrice, discountType) {
  const validation = {};

  if (discountPrice) {
    const hasRegularPrice = !!regularPrice;

    if (!hasRegularPrice) {
      validation.regularPrice = i18next.t(
        LOCALIZATION.REGULAR_PRICE_REQUIRED_WHEN_DISCOUNTED,
      );
    }

    const regularPriceFloat = hasRegularPrice && parseFloat(regularPrice);
    const discountPriceFloat = parseFloat(discountPrice);

    if (hasRegularPrice && discountPriceFloat >= regularPriceFloat) {
      validation.discountPrice = i18next.t(
        LOCALIZATION.DISCOUNT_PRICE_HIGHER_THAN_REGULAR,
      );
    }

    if (!discountType) {
      validation.discountType = i18next.t(
        LOCALIZATION.DISCOUNT_TYPE_REQUIRED_WHEN_DISCOUNTED,
      );
    }
  }

  return validation;
}

function validateStartEndTime(startTime, endTime) {
  if (!endTime) {
    return {
      endTime: validateRequiredField(endTime),
    };
  }

  const resolvedStartTime = !!startTime ? startTime : DEFAULT_START_TIME;
  const momentStartTime = moment(resolvedStartTime);
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
    currency: validateRequiredField(currency),
    couponsExpirationTime:
      couponsEnabled && validateExpirationTime(couponsExpirationTime),
    buyLink: validateUrl(buyLink),
    ...validateNumericFields(regularPrice, discountPrice),
    ...validatePricing(regularPrice, discountPrice, discountType),
    ...validateStartEndTime(startTime, endTime),
  };
}
