import _ from 'lodash';
import { createSelector } from 'reselect';
import {
  cloneStatus,
  getCollection,
  getMeta,
  getOne,
  hasNext,
  hasPrev,
  isBusy,
} from '@shoutem/redux-io';
import { ext } from '../const';

export function getCards(state) {
  const { cards } = state[ext()];
  return getCollection(cards, state);
}

export const getAllCards = createSelector([getCards], cards => {
  const cardsWithUser = _.filter(cards, card => _.has(card, 'user'));
  const cardsByUserId = _.keyBy(cardsWithUser, 'user.id');
  cloneStatus(cards, cardsByUserId);

  return cardsByUserId;
});

export const getUserCard = createSelector(
  [getCards, (_state, userId) => userId],
  (cards, userId) => {
    if (!userId) {
      return null;
    }

    const userCard = _.find(cards, card => card.user?.id === userId);

    return userCard?.id;
  },
);

export function getUsers(state) {
  const { users } = state[ext()];
  return getCollection(users, state);
}

export function getTransactions(state) {
  const { transactionsPage } = state[ext()];
  return getCollection(transactionsPage, state);
}

export function getTransactionPaginationInfo(state, filteredTransactions) {
  if (_.isEmpty(filteredTransactions)) {
    return { transactionCount: 0, hasNext: false, hasPrev: false };
  }

  const transactions = getTransactions(state);
  const meta = getMeta(transactions);

  return {
    transactionCount: _.get(meta, 'count', 0),
    hasNext: hasNext(transactions),
    hasPrev: hasPrev(transactions),
  };
}

export const getTransactionInfos = createSelector(
  [getTransactions, getUsers, getCards],
  (transactions, users, cards) => {
    const usersById = _.keyBy(users, 'legacyId');
    const cardsById = _.keyBy(cards, 'id');

    const transactionInfos = _.reduce(
      transactions,
      (result, transaction) => {
        const { id, card, transactionData } = transaction;

        // transaction data contains information about points that were added/removed
        // through that transaction, without it, no point in rendering transaction
        if (!transactionData) {
          return result;
        }

        const userId = _.get(cardsById, `${card}.user.id`);

        result.push({
          id,
          transaction,
          user: usersById[userId],
        });

        return result;
      },
      [],
    );

    cloneStatus(transactions, transactionInfos);

    return transactionInfos;
  },
);

export const getUserTransactionInfos = createSelector(
  [getTransactionInfos, (_state, userId) => userId],
  (transactionInfos, userId) => {
    if (!userId) {
      return transactionInfos;
    }

    const transactions = _.filter(
      transactionInfos,
      transaction => transaction.user.legacyId === userId,
    );

    cloneStatus(transactionInfos, transactions);

    return transactions;
  },
);

export function getGeneralStatsState(state) {
  return state[ext()].generalStats;
}

export function isDataLoading(state) {
  return (
    isBusy(getGeneralStatsState(state)) || isBusy(getTransactionInfos(state))
  );
}

export const getGeneralStats = createSelector(
  [state => getOne(getGeneralStatsState(state), state)],
  generalStats => {
    const stats = {
      totalEarnedPoints: generalStats.totalEarnedPoints,
      totalRedeemedPoints: generalStats.totalRedeemedPoints,
    };

    cloneStatus(generalStats, stats);

    return stats;
  },
);
