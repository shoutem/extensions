import _ from 'lodash';
import { cloneStatus, getOne, getCollection } from '@shoutem/redux-io';
import {
  ext,
  DEALS_STORAGE,
  DEAL_STATUS_ACTIONS,
  DEAL_TRANSACTIONS_STORAGE,
  TRANSACTIONS_SCHEMA,
  DEALS_SCHEMA,
  COUPONS_SCHEMA,
  MY_DEALS_TAG,
  FAVORITE_DEALS_TAG,
} from '../const';
import { getTransactionAction } from '../services';

export function getCatalogId(shortcut) {
  return _.get(shortcut, 'settings.catalog.id', null);
}

export function getDeals(state) {
  return _.get(state[ext()], DEALS_STORAGE, []);
}

export function getDeal(state, dealId) {
  return getOne(dealId, state, DEALS_SCHEMA);
}

export function getFavoriteDeals(state) {
  return _.get(state[ext()], FAVORITE_DEALS_TAG, []);
}

export function getMyDeals(state) {
  const myDealTransactions = _.get(state[ext()], MY_DEALS_TAG, []);
  const myDeals = getCollection([...myDealTransactions], state, DEALS_SCHEMA);
  cloneStatus(myDealTransactions, myDeals);
  return myDeals;
}

export function getTransaction(state, transactionId) {
  return getOne(transactionId, state, TRANSACTIONS_SCHEMA);
}

/**
 * This function will only return following transaction actions (see ../const.js file):
 *
 *  - DEAL_REDEEMED_ACTION
 *  - COUPON_CLAIMED_ACTION
 *  - COUPON_REDEEMED_ACTION
 *  - COUPON_EXPIRED_ACTION
 *
 * @param {Object} state
 * @param {Number} dealId
 */
export function getDealTransactions(state, dealId) {
  const dealTransactions = _.get(
    state[ext()],
    [
      DEAL_TRANSACTIONS_STORAGE,
      dealId,
      'relationships',
      'transactions',
      'data',
    ],
    [],
  );

  return _.map(dealTransactions, dealTransaction =>
    getTransaction(state, dealTransaction.id),
  );
}

export function getLastDealTransaction(state, dealId) {
  return _.first(getDealTransactions(state, dealId));
}

export function getDealStatusTransactions(state, dealId) {
  return _.filter(getDealTransactions(state, dealId), transaction =>
    _.includes(DEAL_STATUS_ACTIONS, getTransactionAction(transaction)),
  );
}

export function getLastDealStatusTransaction(state, dealId) {
  // Last recorded transaction is actually the first transaction object in the transaction list
  return _.first(getDealStatusTransactions(state, dealId));
}

export function getLastDealAction(state, dealId) {
  return getTransactionAction(getLastDealStatusTransaction(state, dealId));
}

export function getDealCoupon(state, couponId) {
  if (!couponId) {
    return null;
  }

  return getOne(couponId, state, COUPONS_SCHEMA);
}
