// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const APPLICATION_EXTENSION = 'shoutem.application';
export const AUTH_HEADERS = 'headers.Authorization';

// Schemes
export const DEALS_SCHEMA = ext('deals');
export const REDEEM_DEAL_SCHEMA = 'shoutem.deal.deal-redeems';
export const REDEEM_COUPON_SCHEMA = 'shoutem.deal.coupons';
export const CLAIM_COUPON_SCHEMA = ext('CLAIM_COUPON');
export const DEAL_TRANSACTIONS_SCHEMA = 'shoutem.deal.deal-transactions';
export const TRANSACTIONS_SCHEMA = 'shoutem.deal.transactions';
export const COUPONS_SCHEMA = 'shoutem.deal.coupons';

// Tags
export const DEALS_TAG = 'allDeals';
export const DEALS_STORAGE = 'deals';
export const DEAL_TRANSACTIONS_TAG = 'allDealTransactions';
export const DEAL_TRANSACTIONS_STORAGE = 'dealTransactions';
export const TRANSACTIONS_STORAGE = 'transactions';
export const COUPONS_STORAGE = 'coupons';
export const MY_DEALS_TAG = 'myDeals';
export const FAVORITE_DEALS_TAG = 'favoriteDeals';

export const DISCOUNT_PERCENTAGE = 'percentage';
export const DISCOUNT_FIXED = 'fixed';

// Request paths
export const REDEEM_DEAL_PATH =
  'catalogs/{catalogId}/deals/{dealId}/actions/redeem';
export const REDEEM_COUPON_PATH =
  'catalogs/{catalogId}/coupons/{couponId}/actions/redeem';
export const CLAIM_COUPON_PATH = 'catalogs/{catalogId}/coupons';
export const FETCH_COUPON_PATH = 'catalogs/{catalogId}/coupons/{couponId}';
export const DEAL_TRANSACTIONS_PATH =
  'catalogs/{catalogId}/deal-transactions/{dealId}{?query*}';
export const TRANSACTIONS_PATH = 'catalogs/{catalogId}/transactions';

// Transaction actions
export const DEAL_CREATED_ACTION = 'dealCreated';
export const DEAL_UPDATED_ACTION = 'dealUpdated';
export const DEAL_REMOVED_ACTION = 'dealRemoved';
export const DEAL_REDEEMED_ACTION = 'dealRedeemed';
export const COUPON_CLAIMED_ACTION = 'couponClaimed';
export const COUPON_REDEEMED_ACTION = 'couponRedeemed';
export const COUPON_EXPIRED_ACTION = 'couponExpired';
export const COUPON_AVAILABLE_STATUS = 'available';
export const COUPON_EXPIRED_STATUS = 'expired';
export const COUPON_REDEEMED_STATUS = 'redeemed';

export const DEAL_STATUS_ACTIONS = [
  DEAL_REDEEMED_ACTION,
  COUPON_CLAIMED_ACTION,
  COUPON_REDEEMED_ACTION,
  COUPON_EXPIRED_ACTION,
];

export const TRANSLATIONS = {
  REMAINING_COUPONS: ext('couponsRemainingMessage'),
  CLAIM_COUPON_BUTTON: ext('claimCouponButton'),
  REDEEM_COUPON_BUTTON: ext('redeemCouponButton'),
  REDEEM_DEAL_BUTTON: ext('redeemDealButton'),
  DEALS_MAP_BUTTON: ext('dealsMapButton'),
  DEALS_GRID_BUTTON: ext('dealsGridButton'),
  DEALS_LIST_BUTTON: ext('dealsListButton'),
  DEAL_DESCRIPTION_HEADING: ext('dealDescriptionHeading'),
  DEAL_CONDITIONS_HEADING: ext('dealConditionsHeading'),
  PREVIOUS_DEAL_LABEL: ext('previousDealLabel'),
  NEXT_DEAL_LABEL: ext('nextDealLabel'),
  VISIT_WEBSITE_LABEL: ext('visitWebsiteLabel'),
  DEAL_LOCATION_DIRECTIONS_LABEL: ext('dealLocationDirections'),
  COUPON_CLAIMED_TEXT: ext('couponClaimedText'),
  COUPON_REDEEM_TIME_TEXT: ext('couponRedeemTimeText'),
  COUPON_REDEEM_INSTRUCTIONS_TITLE_TEXT: ext(
    'couponRedeemInstructionsTitleText',
  ),
  COUPON_REDEEM_INSTRUCTIONS_TEXT: ext('couponRedeemInstructions'),
  DEAL_REDEEMED_TEXT: ext('dealRedeemedText'),
  MY_DEALS_TITLE: ext('myDealsTitle'),
  MY_DEALS_TAB_TEXT: ext('myDealsTabText'),
  MY_DEALS_AUTHENTICATION_REQUIRED_TEXT: ext(
    'myDealsAuthenticationRequiredText',
  ),
  FAVORITE_DEALS_TAB_TEXT: ext('favoriteDealsTabText'),
};
