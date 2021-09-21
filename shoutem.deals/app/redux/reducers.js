import { combineReducers } from 'redux';
import { storage, collection } from '@shoutem/redux-io';
import { cmsCollection } from 'shoutem.cms';
import {
  COUPONS_SCHEMA,
  COUPONS_STORAGE,
  DEALS_SCHEMA,
  DEALS_TAG,
  DEALS_STORAGE,
  DEAL_TRANSACTIONS_STORAGE,
  DEAL_TRANSACTIONS_SCHEMA,
  MY_DEALS_TAG,
  FAVORITE_DEALS_TAG,
  TRANSACTIONS_SCHEMA,
  TRANSACTIONS_STORAGE,
} from '../const';

export default combineReducers({
  [COUPONS_STORAGE]: storage(COUPONS_SCHEMA),
  [DEALS_STORAGE]: storage(DEALS_SCHEMA),
  [DEALS_TAG]: cmsCollection(DEALS_SCHEMA),
  [MY_DEALS_TAG]: collection(DEAL_TRANSACTIONS_SCHEMA, MY_DEALS_TAG),
  [DEAL_TRANSACTIONS_STORAGE]: storage(DEAL_TRANSACTIONS_SCHEMA),
  [TRANSACTIONS_STORAGE]: storage(TRANSACTIONS_SCHEMA),
  [FAVORITE_DEALS_TAG]: collection(DEALS_SCHEMA, 'favorite'),
});
