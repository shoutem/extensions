import { combineReducers } from 'redux';
import { storage, collection, one } from '@shoutem/redux-io';
import ext from 'src/const';
import {
  TRANSACTIONS,
  TRANSACTION_STATS,
} from '../const';

export const reducer = combineReducers({
  [TRANSACTIONS]: storage(TRANSACTIONS),
  [TRANSACTION_STATS]: storage(TRANSACTION_STATS),
  transactionsPage: collection(TRANSACTIONS, ext('transactionsPage')),
  generalStats: one(TRANSACTION_STATS, ext('generalStats')),
});
