import convert from 'convert-units';
import _ from 'lodash';
import moment from 'moment';
import { dateToString, DEFAULT_TIMEZONE_ID } from 'src/services';
import { DEFAULT_START_TIME } from '../const';

const EXPIRATION_TIME_REGEX = /^0|(\d{1,3})(h|min)$/; // 0 or 15h or 15min
const MILLISECONDS = 'ms';

export function isExpirationTimeValid(expirationTime) {
  const expirationTimeString = _.toString(expirationTime);
  return !!expirationTimeString.match(EXPIRATION_TIME_REGEX);
}

function toServerExpirationTime(expirationTime) {
  if (!isExpirationTimeValid(expirationTime)) {
    return 0;
  }

  const expirationTimeString = _.toString(expirationTime);
  if (expirationTimeString === '0') {
    return 0;
  }

  // eslint-disable-next-line no-unused-vars
  const [__, value, unit] = expirationTimeString.match(EXPIRATION_TIME_REGEX);
  return convert(value)
    .from(unit)
    .to(MILLISECONDS);
}

function toDisplayExpirationTime(expirationTime) {
  if (expirationTime === 0) {
    return '0';
  }

  const display = convert(expirationTime)
    .from(MILLISECONDS)
    .toBest({ exclude: ['d', 'week', 'month', 'year'] });

  return `${display.val}${display.unit}`;
}

function isCouponsLimited(deal) {
  const remainingCoupons = _.get(deal, 'remainingCoupons', null);
  const couponsEnabled = _.get(deal, 'couponsEnabled', false);

  return couponsEnabled && !_.isNull(remainingCoupons);
}

function calculateTotalCoupons(deal) {
  const couponsEnabled = _.get(deal, 'couponsEnabled', false);

  if (!couponsEnabled) {
    return null;
  }

  if (!isCouponsLimited(deal)) {
    return null;
  }

  const remainingCoupons = _.get(deal, 'remainingCoupons', null);
  const claimedCoupons = _.get(deal, 'claimedCoupons', null);
  const redeemedCoupons = _.get(deal, 'redeemedCoupons', null);

  return (
    _.toNumber(remainingCoupons) +
    _.toNumber(claimedCoupons) +
    _.toNumber(redeemedCoupons)
  );
}

/**
 * Transforms UI object to object suitable for communication with server
 */
export function mapViewToModel(deal, catalog) {
  const {
    regularPrice,
    discountPrice,
    couponsExpirationTime,
    claimedCoupons,
    redeemedCoupons,
    remainingCoupons,
    hideRedeemButton,
    couponsEnabled,
    startTime: viewStartTime,
    endTime: viewEndTime,
    publishTime: viewPublishTime,
    timezone,
  } = deal;

  const totalCoupons = calculateTotalCoupons(deal);
  const couponsLimited = isCouponsLimited(deal);

  const available =
    !couponsEnabled || !couponsLimited || _.toNumber(remainingCoupons) > 0;

  const startTime = !!viewStartTime
    ? dateToString(viewStartTime, timezone)
    : null;
  const endTime = dateToString(viewEndTime, timezone);
  const publishTime = viewPublishTime
    ? dateToString(viewPublishTime, timezone)
    : dateToString(moment(DEFAULT_START_TIME), timezone);

  return {
    ..._.omit(deal, ['place', 'categories']),
    catalog,
    couponsLimited,
    available,
    totalCoupons,
    startTime,
    endTime,
    publishTime,
    hideRedeemButton,
    timezone: timezone || DEFAULT_TIMEZONE_ID,
    claimedCoupons: claimedCoupons || 0,
    redeemedCoupons: redeemedCoupons || 0,
    regularPrice: _.toNumber(regularPrice),
    discountPrice: _.toNumber(discountPrice),
    couponsExpirationTime: toServerExpirationTime(couponsExpirationTime),
  };
}

/**
 * Transforms server object to object suitable for displaying on UI
 */
export function mapModelToView(deal) {
  const {
    couponsEnabled,
    couponsExpirationTime,
    place,
    ...otherDealProps
  } = deal;

  const expirationTime = couponsEnabled
    ? toDisplayExpirationTime(couponsExpirationTime)
    : null;
  const placeId = _.get(place, 'id');

  return {
    couponsEnabled,
    couponsExpirationTime: expirationTime,
    place: placeId,
    ...otherDealProps,
  };
}
