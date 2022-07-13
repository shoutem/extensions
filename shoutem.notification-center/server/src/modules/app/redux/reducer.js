import { combineReducers } from 'redux';
import ext from 'src/const';
import { one, storage } from '@shoutem/redux-io';
import { APPLICATION_STATUS } from '../const';

export const reducer = combineReducers({
  [APPLICATION_STATUS]: storage(APPLICATION_STATUS),
  applicationStatus: one(APPLICATION_STATUS, ext('status')),
});
