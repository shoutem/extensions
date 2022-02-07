import i18next from 'i18next';
import _ from 'lodash';
import { isNumeric } from 'validator';
import { getMeta } from '@shoutem/redux-io';
import LOCALIZATION from './localization';

function validateTransactionPoints(points) {
  if (_.isEmpty(points)) {
    return { points: i18next.t(LOCALIZATION.POINTS_MISSING_MESSAGE) };
  }

  if (!isNumeric(points)) {
    return { points: i18next.t(LOCALIZATION.ONLY_NUMBER_ALLOWED_MESSAGE) };
  }

  return null;
}

function validateUser(user) {
  if (!user) {
    return i18next.t(LOCALIZATION.USER_MISSING_MESSAGE);
  }

  return null;
}

function validatePlace(place) {
  if (!place) {
    return i18next.t(LOCALIZATION.PLACE_MISSING_MESSAGE);
  }

  return null;
}

function validateReward(reward) {
  if (!reward) {
    return i18next.t(LOCALIZATION.PUNCH_MISSING_MESSAGE);
  }

  return null;
}

export function getTransactionCount(transactions) {
  const meta = getMeta(transactions);
  return _.get(meta, 'count', 0);
}

export function validateSingleCardTransaction(transaction) {
  const { points, user } = transaction;

  return {
    points: validateTransactionPoints(points),
    user: validateUser(user),
  };
}

export function validateMultiCardTransaction(transaction) {
  const { points, user, place } = transaction;

  return {
    points: validateTransactionPoints(points),
    user: validateUser(user),
    place: validatePlace(place),
  };
}

export function validatePunchCardTransaction(transaction) {
  const { points, user, reward } = transaction;

  return {
    points: validateTransactionPoints(points),
    user: validateUser(user),
    reward: validateReward(reward),
  };
}
