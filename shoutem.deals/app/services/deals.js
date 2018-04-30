import _ from 'lodash';
import moment from 'moment';

import PropTypes from 'prop-types';

import {
  COUPON_CLAIMED_ACTION,
  COUPON_REDEEMED_ACTION,
  COUPON_AVAILABLE_STATUS,
  COUPON_REDEEMED_STATUS,
  DEAL_REDEEMED_ACTION,
  COUPON_EXPIRED_STATUS,
  COUPON_EXPIRED_ACTION,
} from '../const';

export const dealStatusShape = PropTypes.shape({
  couponsEnabled: PropTypes.bool,
  couponClaimed: PropTypes.bool,
  couponRedeemed: PropTypes.bool,
  dealRedeemed: PropTypes.bool,
});

export function getTransactionAction(transaction) {
  return _.get(transaction, 'action', null);
}

export function getDealImages(deal) {
  return _.filter([
    _.get(deal, 'image1', null),
    _.get(deal, 'image2', null),
    _.get(deal, 'image3', null),
  ], image => !_.isEmpty(image));
}

export function dealCouponsEnabled(deal) {
  return (_.get(deal, 'couponsEnabled') === true);
}

/**
 * This function will check if deal is available for claim/redeem functionality.
 * @param {Object} deal
 */
export function isDealActive(deal) {
  const {
    startTime: startTimeString,
    endTime: endTimeString,
  } = deal;

  const today = moment();
  const startTime = moment(startTimeString);
  const endTime = moment(endTimeString);

  return (
    startTime.isBefore(today) &&
    endTime.isAfter(today)
  );
}

export function isDealCouponExpired(lastDealTransaction) {
  if (getTransactionAction(lastDealTransaction) === COUPON_EXPIRED_ACTION) {
    return true;
  }

  // return false;

  if (getTransactionAction(lastDealTransaction) === COUPON_REDEEMED_ACTION) {
    return false;
  }

  /**
   * There is no need to check coupon status because coupon status and
   * transaction action are always in sync.
   */
  const coupon = _.get(lastDealTransaction, 'coupon');
  if (_.isEmpty(coupon)) {
    return false;
  }

  const couponExpiryTime = moment(coupon.expiresAt);
  const today = moment();

  return today.isAfter(couponExpiryTime);
}

export function isDealCouponClaimed(lastDealTransaction) {
  return (
    (getTransactionAction(lastDealTransaction) === COUPON_CLAIMED_ACTION) &&
    !isDealCouponExpired(lastDealTransaction)
  );
}

export function isDealCouponRedeemed(lastDealTransaction) {
  return (getTransactionAction(lastDealTransaction) === COUPON_REDEEMED_ACTION);
}

export function isDealRedeemed(lastDealTransaction) {
  return (getTransactionAction(lastDealTransaction) === DEAL_REDEEMED_ACTION);
}

export function isCouponStatusAvailable(coupon) {
  return _.get(coupon, 'status') === COUPON_AVAILABLE_STATUS;
}

export function isCouponStatusRedeemed(coupon) {
  return _.get(coupon, 'status') === COUPON_REDEEMED_STATUS;
}

export function isCouponStatusExpired(coupon) {
  return _.get(coupon, 'status') === COUPON_EXPIRED_STATUS;
}

export function isDealImageGallery(deal) {
  const images = getDealImages(deal);

  return (_.size(images) > 1);
}

export function getDealStatus(deal, lastDealTransaction) {
  return {
    couponsEnabled: dealCouponsEnabled(deal),
    couponClaimed: isDealCouponClaimed(lastDealTransaction),
    couponRedeemed: isDealCouponRedeemed(lastDealTransaction),
    couponExpired: isDealCouponExpired(lastDealTransaction),
    dealRedeemed: isDealRedeemed(lastDealTransaction),
  };
}

/**
 * Only if deal last action is COUPON_CLAIMED_ACTION, id is returned
 * @param {Object} lastDealTransaction Deal last transaction record object
 */
export function getDealActiveCoupon(lastDealTransaction) {
  const couponActions = [COUPON_CLAIMED_ACTION, COUPON_REDEEMED_ACTION];

  if (!_.includes(couponActions, getTransactionAction(lastDealTransaction))) {
    return null;
  }

  return _.get(lastDealTransaction, ['coupon']);
}

export function getTimeLeft(initialSecondsLeft) {
  let secondsLeft = initialSecondsLeft;

  // Calculate hours left
  const hoursLeft = Math.floor(secondsLeft / 3600);
  if (hoursLeft >= 1) {
    secondsLeft = secondsLeft - Math.floor(hoursLeft * 3600);
  }

  // Calculate minutes left
  let minutesLeft = Math.floor(secondsLeft / 60);
  secondsLeft = secondsLeft - Math.floor(minutesLeft * 60);

  if (secondsLeft > 0) {
    minutesLeft += 1;
  }

  return {
    hoursLeft,
    minutesLeft,
    secondsLeft,
  };
}
