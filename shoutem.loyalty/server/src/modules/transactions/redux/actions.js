import _ from 'lodash';
import ext, { LOYALTY_TYPES } from 'src/const';
import { PUNCH_CARDS } from 'src/modules/punch-rewards';
import { getLoyaltyUrl } from 'src/services';
import { create, find, next, prev, remove } from '@shoutem/redux-io';
import { CARD_TYPES, TRANSACTION_STATS, TRANSACTIONS } from '../const';

function generateTransactionsFilter(loyaltyType, filter) {
  const { cardId, rewardId, cashierId, placeId } = filter;

  const cardType =
    loyaltyType === LOYALTY_TYPES.PUNCH ? CARD_TYPES.PUNCH : CARD_TYPES.POINTS;

  const locationFilter =
    loyaltyType === LOYALTY_TYPES.POINTS ? 'null' : placeId;

  return {
    'filter[card]': cardId,
    'filter[punchReward]': rewardId,
    'filter[location]': locationFilter,
    'filter[cashier]': cashierId,
    'filter[cardType]': cardType,
  };
}

export function loadTransactions(
  programId,
  loyaltyType,
  filter = {},
  scope = {},
) {
  const transactionFilter = generateTransactionsFilter(loyaltyType, filter);

  const params = {
    q: {
      ...transactionFilter,
      'page[limit]': 10,
      'page[offset]': 0,
    },
    ...scope,
  };

  const config = {
    schema: TRANSACTIONS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/transactions{?q*}`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('transactionsPage'), params);
}

export function loadNextTransactionsPage(transactions) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return next(transactions, false, config);
}

export function loadPreviousTransactionsPage(transactions) {
  const config = {
    request: {
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return prev(transactions, false, config);
}

export function createTransaction(
  programId,
  transactionOptions,
  appId,
  scope = {},
) {
  const { cardId, reward, place, points } = transactionOptions;

  const rewardId = reward && reward.value;
  const placeId = place && place.value;
  const config = {
    schema: TRANSACTIONS,
    request: {
      endpoint: getLoyaltyUrl(`/v1/programs/${programId}/transactions`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  // this is reference to CMS collection that contains given reward
  const rewardCmsInfo = { appId, schema: PUNCH_CARDS };
  const cms = rewardId ? rewardCmsInfo : undefined;

  const transaction = {
    type: TRANSACTIONS,
    attributes: {
      card: cardId,
      punchReward: rewardId,
      authorizations: [{ authorizationType: 'admin' }],
      transactionData: {
        cms,
        location: placeId,
        points: _.toNumber(points),
      },
    },
  };

  return create(config, transaction, scope);
}

export function deleteTransaction(transactionId, programId, scope = {}) {
  const config = {
    schema: TRANSACTIONS,
    request: {
      endpoint: getLoyaltyUrl(
        `/v1/programs/${programId}/transactions/${transactionId}`,
      ),
      headers: {},
    },
  };

  const transaction = {
    type: TRANSACTIONS,
    id: transactionId,
  };

  return remove(config, transaction, scope);
}

export function loadGeneralStats(
  programId,
  loyaltyType,
  filter = {},
  scope = {},
) {
  const transactionFilter = generateTransactionsFilter(loyaltyType, filter);

  const params = {
    q: transactionFilter,
    ...scope,
  };

  const config = {
    schema: TRANSACTION_STATS,
    request: {
      endpoint: getLoyaltyUrl(
        `/v1/programs/${programId}/reporting/general-stats{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('generalStats'), params);
}
