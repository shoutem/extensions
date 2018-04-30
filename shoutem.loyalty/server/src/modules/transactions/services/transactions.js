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

export function getTransactionCount(transactions) {
  const meta = getMeta(transactions);
  return _.get(meta, 'count', 0);
}

export function validateTransaction(transaction) {
  const { points, userId } = transaction;

  return {
    points : validateTransactionPoints(points),
    userId: validateUserId(userId),
  };
}
