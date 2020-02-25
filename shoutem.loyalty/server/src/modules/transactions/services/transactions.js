import _ from 'lodash';
import { isNumeric } from 'validator';
import { getMeta } from '@shoutem/redux-io';

function validateTransactionPoints(points) {
  if (_.isEmpty(points)) {
    return { points: 'Points must be provided' };
  }

  if (!isNumeric(points)) {
    return { points: 'Only numbers are allowed' };
  }

  return null;
}

function validateUser(user) {
  if (!user) {
    return 'User must be provided';
  }

  return null;
}

function validatePlace(place) {
  if (!place) {
    return 'Place must be provided';
  }

  return null;
}

function validateReward(reward) {
  if (!reward) {
    return 'Punch card must be provided';
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
