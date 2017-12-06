import _ from 'lodash';
import { isNumeric } from 'validator';
import { getMeta } from '@shoutem/redux-io';

export function getTransactionCount(transactions) {
  const meta = getMeta(transactions);
  return _.get(meta, 'count', 0);
}

export function validateTransaction(transaction) {
  const { points } = transaction;

  if (_.isEmpty(points)) {
    return { points: 'Points must be provided' };
  }

  if (!isNumeric(points)) {
    return { points: 'Only numbers are allowed' };
  }

  return null;
}
