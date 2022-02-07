import _ from 'lodash';
import { createSelector } from 'reselect';
import ext from 'src/const';
import { getCashiers } from 'src/modules/cashiers';
import { getCards, getLoyaltyPlaces, getUsers } from 'src/modules/program';
import { getPunchRewards } from 'src/modules/punch-rewards';
import { cloneStatus, getCollection, getOne } from '@shoutem/redux-io';
import { moduleName } from '../const';

export function getTransactionsState(state) {
  return state[ext()][moduleName];
}

export function getTransactions(state) {
  const transactions = getTransactionsState(state).transactionsPage;
  return getCollection(transactions, state);
}

export function getGeneralStats(state) {
  const { generalStats } = getTransactionsState(state);
  return getOne(generalStats, state);
}

export const getTransactionInfos = createSelector(
  state => getTransactions(state),
  state => getUsers(state),
  state => getCards(state),
  state => getPunchRewards(state),
  state => getCashiers(state),
  state => getLoyaltyPlaces(state),
  (transactions, users, cards, punchRewards, cashiers, places) => {
    const usersById = _.keyBy(users, 'legacyId');
    const cardsById = _.keyBy(cards, 'id');
    const punchRewardsById = _.keyBy(punchRewards, 'id');
    const cashiersById = _.keyBy(cashiers, 'id');
    const placesById = _.keyBy(places, 'id');

    const transactionInfos = _.reduce(
      transactions,
      (result, transaction) => {
        const { id, card, punchReward, transactionData } = transaction;

        // transaction data contains information about points that were added/removed
        // through that transaction, without it, no point in rendering transaction
        if (!transactionData) {
          return result;
        }

        const { location, cashier } = transactionData;
        const userId = _.get(cardsById[card], 'user.id');

        result.push({
          id,
          transaction,
          cashier: cashiersById[cashier],
          place: placesById[location],
          user: usersById[userId],
          reward: punchRewardsById[punchReward],
        });

        return result;
      },
      [],
    );

    cloneStatus(transactions, transactionInfos);
    return transactionInfos;
  },
);
