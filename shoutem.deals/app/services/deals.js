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
  return _.filter(
    [
      _.get(deal, 'image1', null),
      _.get(deal, 'image2', null),
      _.get(deal, 'image3', null),
    ],
    image => !_.isEmpty(image),
  );
}

export function dealCouponsEnabled(deal) {
  return deal?.couponsEnabled === true;
}

/**
 * This function will return a link with character length of 30, while also
 * appending ellipsis (...)
 * Links that are too long will "break" the layout, so they have to be truncated
 * @param {String} buyLink
 */
export function resolveDealBuyDisplayLink(buyLink) {
  return _.truncate(buyLink, { length: 30 });
}

/**
 * This function will check if deal is available for claim/redeem functionality.
 * @param {Object} deal
 */
export function isDealActive(deal) {
  const { startTime: startTimeString, endTime: endTimeString } = deal;

  const now = moment();
  const endTime = moment(endTimeString);

  if (!startTimeString) {
    return endTime.isAfter(now);
  }

  const startTime = moment(startTimeString);

  return startTime.isBefore(now) && endTime.isAfter(now);
}

export function isDealCouponExpired(lastDealTransaction) {
  if (getTransactionAction(lastDealTransaction) === COUPON_EXPIRED_ACTION) {
    return true;
  }

  if (getTransactionAction(lastDealTransaction) === COUPON_REDEEMED_ACTION) {
    return false;
  }

  /**
   * There is no need to check coupon status because coupon status and
   * transaction action are always in sync.
   */
  const coupon = lastDealTransaction?.coupon;
  if (_.isEmpty(coupon)) {
    return false;
  }

  const couponExpiryTime = moment(coupon.expiresAt);
  const today = moment();

  return today.isAfter(couponExpiryTime);
}

export function isDealCouponClaimed(lastDealTransaction) {
  return (
    getTransactionAction(lastDealTransaction) === COUPON_CLAIMED_ACTION &&
    !isDealCouponExpired(lastDealTransaction)
  );
}

export function isDealCouponRedeemed(lastDealTransaction) {
  return getTransactionAction(lastDealTransaction) === COUPON_REDEEMED_ACTION;
}

export function isDealRedeemed(lastDealTransaction) {
  return getTransactionAction(lastDealTransaction) === DEAL_REDEEMED_ACTION;
}

export function isCouponStatusAvailable(coupon) {
  return coupon?.status === COUPON_AVAILABLE_STATUS;
}

export function isCouponStatusRedeemed(coupon) {
  return coupon?.status === COUPON_REDEEMED_STATUS;
}

export function isCouponStatusExpired(coupon) {
  return coupon?.status === COUPON_EXPIRED_STATUS;
}

export function isDealImageGallery(deal) {
  const images = getDealImages(deal);

  return _.size(images) > 1;
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

  return lastDealTransaction?.coupon;
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
