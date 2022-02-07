import { combineReducers } from 'redux';
import { collection, one, storage } from '@shoutem/redux-io';
import { ext } from '../const';
import {
  AUTHORIZATIONS,
  CARDS,
  PROGRAMS,
  TRANSACTION_STATS,
  TRANSACTIONS,
  USERS,
} from './actions';

export const reducer = combineReducers({
  cards: collection(CARDS, ext('cards')),
  authorizations: collection(AUTHORIZATIONS, ext('authorizations')),
  users: collection(USERS, ext('users')),
  programs: collection(PROGRAMS, ext('programs')),
  transactions: collection(TRANSACTIONS, ext('transactions'), {
    expirationTime: 5 * 60,
  }),
  transactionsPage: collection(TRANSACTIONS, ext('transactionsPage')),
  generalStats: one(TRANSACTION_STATS, ext('generalStats')),
  storage: combineReducers({
    [CARDS]: storage(CARDS),
    [USERS]: storage(USERS),
    [AUTHORIZATIONS]: storage(AUTHORIZATIONS),
    [PROGRAMS]: storage(PROGRAMS),
    [TRANSACTIONS]: storage(TRANSACTIONS),
    [TRANSACTION_STATS]: storage(TRANSACTION_STATS),
  }),
});
