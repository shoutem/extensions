import _ from 'lodash';
import { create, find, next, prev, remove } from '@shoutem/redux-io';
import { ext } from '../const';
import { shoutemUrls } from '../services';

export const RULES = 'shoutem.loyalty.rules';
export const PROGRAMS = 'shoutem.loyalty.programs';
export const AUTHORIZATIONS = 'shoutem.loyalty.authorizations';
export const CARDS = 'shoutem.loyalty.cards';
export const USERS = 'shoutem.core.users';
export const TRANSACTIONS = 'shoutem.loyalty.transactions';
export const TRANSACTION_STATS = 'shoutem.loyalty.reporting.general-stats';
export const PLACES = ext('places');

const MAX_PAGE_SIZE = 10000;

function createProgram(context, scope) {
  const config = {
    schema: PROGRAMS,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl('/v1/programs'),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newProgram = {
    type: PROGRAMS,
    attributes: {
      name: 'My Program',
    },
  };

  const appOwnerId = _.get(context, 'appOwnerId');
  _.set(newProgram, ['attributes', 'owner', 'id'], appOwnerId);

  return create(config, newProgram, scope);
}

export function createAuthorization(programId, authorizationData, scope = {}) {
  const config = {
    schema: AUTHORIZATIONS,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl(
        `/v1/programs/${programId}/authorizations`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const authorization = {
    type: AUTHORIZATIONS,
    attributes: authorizationData,
  };

  return create(config, authorization, scope);
}

export function loadCards(programId, scope = {}) {
  const config = {
    schema: CARDS,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl(`/v1/programs/${programId}/cards`),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('cards'), scope);
}

export function createRule(rule, programId, placeId, scope = {}) {
  const config = {
    schema: RULES,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl(`/v1/programs/${programId}/rules`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newRule = {
    type: RULES,
    attributes: {
      ...rule,
      location: placeId,
    },
  };

  return create(config, newRule, scope);
}

export function enableAffiliate(
  authorizationTypes = ['pin', 'userId', 'admin'],
  context,
  scope = {},
) {
  return dispatch =>
    dispatch(createProgram(context, scope)).then(action => {
      const programId = _.get(action, ['payload', 'data', 'id']);

      const authActions = _.map(authorizationTypes, authorizationType => {
        const authorization = {
          authorizationType,
          implementationData: {},
        };
        return dispatch(createAuthorization(programId, authorization, scope));
      });

      return Promise.all(authActions).then(() => programId);
    });
}

export function createCard(programId, userId, scope = {}) {
  const config = {
    schema: CARDS,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl(`/v1/programs/${programId}/cards`),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const newCard = {
    type: CARDS,
    attributes: {
      user: { id: userId },
    },
  };

  return create(config, newCard, scope);
}

export function createTransactionAndCard(
  programId,
  userId,
  cardId,
  transactionOptions,
) {
  return async dispatch => {
    if (cardId) {
      return dispatch(
        createTransaction(programId, { cardId, ...transactionOptions }),
      );
    }

    const response = await dispatch(createCard(programId, userId));
    const newCardId = response.payload.data?.id;

    return dispatch(
      createTransaction(programId, {
        cardId: newCardId,
        ...transactionOptions,
      }),
    );
  };
}

export function createTransaction(programId, transactionOptions, scope = {}) {
  const { cardId, points } = transactionOptions;

  const config = {
    schema: TRANSACTIONS,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl(
        `/v1/programs/${programId}/transactions`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
        'Content-Type': 'application/vnd.api+json',
      },
    },
  };

  const transaction = {
    type: TRANSACTIONS,
    attributes: {
      card: cardId,
      authorizations: [{ authorizationType: 'admin' }],
      transactionData: {
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
      endpoint: shoutemUrls.buildLoyaltyUrl(
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

export function loadTransactions(programId, cardId = null, scope = {}) {
  const params = {
    q: {
      'page[limit]': 10,
      'page[offset]': 0,
      'filter[cardType]': 'points',
      'filter[card]': cardId,
    },
    ...scope,
  };

  const config = {
    schema: TRANSACTIONS,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl(
        `/v1/programs/${programId}/transactions{?q*}`,
      ),
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

export function loadUsers(appId, scope = {}) {
  const params = {
    q: { 'page[limit]': MAX_PAGE_SIZE },
    ...scope,
  };

  const config = {
    schema: USERS,
    request: {
      endpoint: shoutemUrls.buildAuthUrl(
        `/v1/realms/externalReference:${appId}/users{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('users'), params);
}

export function loadGeneralStats(programId, cardId) {
  const params = {
    q: {
      'filter[card]': cardId,
    },
    extensionName: ext(),
  };

  const config = {
    schema: TRANSACTION_STATS,
    request: {
      endpoint: shoutemUrls.buildLoyaltyUrl(
        `/v1/programs/${programId}/reporting/general-stats{?q*}`,
      ),
      headers: {
        Accept: 'application/vnd.api+json',
      },
    },
  };

  return find(config, ext('generalStats'), params);
}
