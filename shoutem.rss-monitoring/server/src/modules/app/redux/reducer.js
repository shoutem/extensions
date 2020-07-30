import { storage, one } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import ext from '../../../const';
import { APPLICATION_STATUS } from '../const';

export const reducer = combineReducers({
  [APPLICATION_STATUS]: storage(APPLICATION_STATUS),
  applicationStatus: one(APPLICATION_STATUS, ext('status')),
});
