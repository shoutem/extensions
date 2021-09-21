import { create, find, RESOLVED_ENDPOINT } from '@shoutem/redux-io';
import { APPEND_MODE } from '@shoutem/redux-io/actions/find';

import {
  DEALS_SCHEMA,
  DEAL_TRANSACTIONS_SCHEMA,
  COUPONS_SCHEMA,
  CLAIM_COUPON_SCHEMA,
  REDEEM_COUPON_SCHEMA,
  REDEEM_DEAL_SCHEMA,
  MY_DEALS_TAG,

  // Actions
  DEAL_REDEEMED_ACTION,
  COUPON_CLAIMED_ACTION,
  COUPON_REDEEMED_ACTION,
  COUPON_EXPIRED_ACTION,
} from '../const';

export function fetchDeal(dealId) {
  return find(
    DEALS_SCHEMA,
    undefined,
    {
      query: {
        'filter[id]': dealId,
      },
    },
    {
      [APPEND_MODE]: true,
      [RESOLVED_ENDPOINT]: true,
    },
  );
}

export function fetchDealTransactions(catalogId, dealId) {
  const request = {
    schema: DEAL_TRANSACTIONS_SCHEMA,
    request: {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return dispatch =>
    dispatch(
      find(request, '', {
        catalogId,
        dealId,
      }),
    );
}

export function fetchDealListTransactions(catalogId, dealIdList) {
  const idList = [...dealIdList];

  const request = {
    schema: DEAL_TRANSACTIONS_SCHEMA,
    request: {
      method: 'GET',
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return dispatch =>
    dispatch(
      find(request, '', {
        catalogId,
        query: {
          'filter[deal.id]': idList.join(','),
        },
      }),
    );
}

export function fetchMyDealTransactions(catalogId) {
  return dispatch =>
    dispatch(
      find(DEAL_TRANSACTIONS_SCHEMA, MY_DEALS_TAG, {
        catalogId,
        query: {
          'filter[action]': [
            DEAL_REDEEMED_ACTION,
            COUPON_CLAIMED_ACTION,
            COUPON_REDEEMED_ACTION,
            COUPON_EXPIRED_ACTION,
          ].join(','),
          'filter[lastTransactionOnly]': 'true',
        },
      }),
    );
}

export function fetchDealCoupon(catalogId, couponId) {
  return find(COUPONS_SCHEMA, '', {
    catalogId,
    couponId,
  });
}

export function claimCoupon(catalogId, dealId) {
  const request = {
    schema: CLAIM_COUPON_SCHEMA,
    request: {
      body: JSON.stringify({
        data: {
          type: 'shoutem.deal.coupons',
          relationships: {
            deal: {
              data: {
                type: DEALS_SCHEMA,
                id: dealId,
              },
            },
          },
        },
      }),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return dispatch =>
    dispatch(create(request, null, { catalogId })).then(() =>
      dispatch(fetchDealTransactions(catalogId, dealId)),
    );
}

export function redeemCoupon(catalogId, dealId, couponId) {
  const request = {
    schema: REDEEM_COUPON_SCHEMA,
    request: {
      body: JSON.stringify({
        data: {
          type: REDEEM_COUPON_SCHEMA,
          relationships: {
            deal: {
              data: {
                type: DEALS_SCHEMA,
                id: dealId,
              },
            },
          },
        },
      }),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return dispatch =>
    dispatch(create(request, null, { catalogId, couponId })).then(() =>
      dispatch(fetchDealTransactions(catalogId, dealId)),
    );
}

export function redeemDeal(catalogId, dealId) {
  const request = {
    schema: REDEEM_DEAL_SCHEMA,
    request: {
      body: JSON.stringify({
        data: {
          type: REDEEM_DEAL_SCHEMA,
        },
      }),
      method: 'POST',
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  return dispatch =>
    dispatch(create(request, null, { catalogId, dealId })).then(() =>
      dispatch(fetchDealTransactions(catalogId, dealId)),
    );
}
