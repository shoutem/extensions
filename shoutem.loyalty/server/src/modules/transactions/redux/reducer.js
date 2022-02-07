import { combineReducers } from 'redux';
import ext from 'src/const';
import { collection, one, storage } from '@shoutem/redux-io';
import { TRANSACTION_STATS, TRANSACTIONS } from '../const';

export const reducer = combineReducers({
  [TRANSACTIONS]: storage(TRANSACTIONS),
  [TRANSACTION_STATS]: storage(TRANSACTION_STATS),
  transactionsPage: collection(TRANSACTIONS, ext('transactionsPage')),
  generalStats: one(TRANSACTION_STATS, ext('generalStats')),
});
