import { combineReducers } from 'redux';
import _ from 'lodash';
import { loadResources } from '@shoutem/cms-dashboard';
import { batchActions } from 'redux-batched-actions';
import moment from 'moment';
import {
  find,
  create,
  next,
  prev,
  collection,
  getCollection,
  invalidate,
} from '@shoutem/redux-io';
import { ext } from 'src/const';
import { dealsApi, types, dateToString } from 'src/services';
import { moduleName, TRANSACTION_ACTIONS } from './const';

// CONST
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;

function formatStartTimeFilter(startDate) {
  if (!startDate) {
    return null;
  }

  const startDateFilter = moment(startDate).subtract(1, 'seconds');
  return dateToString(startDateFilter);
}

function formatEndTimeFilter(endDate) {
  if (!endDate) {
    return null;
  }

  const endDateFilter = moment(endDate).add(1, 'seconds');
  return dateToString(endDateFilter);
}

// SELECTORS
function getStatsState(state) {
  return state[ext()][moduleName];
}

export function getDealStats(state) {
  const dealStats = getStatsState(state).deals;
  return getCollection(dealStats, state);
}

export function getTransactionStats(state) {
  const transactionStats = getStatsState(state).transactions;
  return getCollection(transactionStats, state);
}

// ACTIONS
export function loadDealStats(appId, filter = {}, scope = {}) {
  const { searchTerm, startTime, endTime } = filter;
  const titleFilter = _.isEmpty(searchTerm) ? null : _.trim(searchTerm);

  const cmsFilter = {
    'filter[title]': titleFilter,
    'filter[startTime][gt]': formatStartTimeFilter(startTime),
    'filter[endTime][lt]': formatEndTimeFilter(endTime),
    'page[limit]': DEFAULT_LIMIT,
    'page[offset]': DEFAULT_OFFSET,
  };

  return loadResources(
    appId,
    undefined,
    types.DEALS,
    ext('dealStats'),
    cmsFilter,
    scope,
  );
}

export function loadNextPage(stats) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return next(stats, false, config);
}

export function loadPreviousPage(stats) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return prev(stats, false, config);
}

export function loadTransactionStats(
  catalogId,
  dealId,
  filter = {},
  scope = {},
) {
  const { startTime, endTime } = filter;
  const transactionActions = [
    TRANSACTION_ACTIONS.COUPON_CLAIMED,
    TRANSACTION_ACTIONS.COUPON_REDEEMED,
    TRANSACTION_ACTIONS.DEAL_REDEEMED,
  ];

  const params = {
    q: {
      'filter[deal]': dealId,
      'filter[startTime]': formatStartTimeFilter(startTime),
      'filter[endTime]': formatEndTimeFilter(endTime),
      'filter[action]': transactionActions.join(','),
      'page[offset]': DEFAULT_OFFSET,
      'page[limit]': DEFAULT_LIMIT,
    },
    ...scope,
  };

  const config = {
    schema: types.TRANSACTIONS,
    request: {
      endpoint: dealsApi.buildUrl(
        `/v1/catalogs/${catalogId}/transactions{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('transactionStats'), params);
}

export function createTransaction(catalogId, dealId, action, scope = {}) {
  const config = {
    schema: types.TRANSACTIONS,
    request: {
      endpoint: dealsApi.buildUrl(`/v1/catalogs/${catalogId}/transactions`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const transaction = {
    type: types.TRANSACTIONS,
    attributes: {
      action,
      deal: { id: dealId },
    },
  };

  return create(config, transaction, scope);
}

export function createCatalog(appId, categoryId, scope = {}) {
  const config = {
    schema: types.CATALOGS,
    request: {
      endpoint: dealsApi.buildUrl('/v1/catalogs'),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const catalog = {
    type: types.CATALOGS,
    attributes: {
      application: {
        id: appId,
      },
      place: {
        cms: {
          schema: types.PLACES,
        },
      },
      deal: {
        cms: {
          categoryId,
          schema: types.DEALS,
        },
      },
    },
  };

  return create(config, catalog, scope);
}

export function invalidateStats() {
  const actions = [invalidate(types.DEALS), invalidate(types.TRANSACTIONS)];

  return batchActions(actions);
}

export const reducer = () =>
  combineReducers({
    deals: collection(types.DEALS, ext('dealStats')),
    transactions: collection(types.TRANSACTIONS, ext('transactionStats')),
  });
