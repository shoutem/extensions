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

function validateUserId(userId) {
  if (!userId) {
    return 'User must be provided';
  }

  return null;
}

function validatePlaceId(placeId) {
  if (!placeId) {
    return 'Place must be provided';
  }

  return null;
}

function validateRewardId(rewardId) {
  if (!rewardId) {
    return 'Punch card must be provided';
  }

  return null;
}

export function getTransactionCount(transactions) {
  const meta = getMeta(transactions);
  return _.get(meta, 'count', 0);
}

export function validateSingleCardTransaction(transaction) {
  const { points, userId } = transaction;

  return {
    points: validateTransactionPoints(points),
    userId: validateUserId(userId),
  };
}

export function validateMultiCardTransaction(transaction) {
  const { points, userId, placeId } = transaction;

  return {
    points: validateTransactionPoints(points),
    userId: validateUserId(userId),
    placeId: validatePlaceId(placeId),
  };
}

export function validatePunchCardTransaction(transaction) {
  const { points, userId, rewardId } = transaction;

  return {
    points: validateTransactionPoints(points),
    userId: validateUserId(userId),
    rewardId: validateRewardId(rewardId),
  };
}
