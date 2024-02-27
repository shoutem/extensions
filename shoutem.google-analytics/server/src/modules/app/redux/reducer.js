import { combineReducers } from 'redux';
import { one, storage } from '@shoutem/redux-io';
import ext from '../../../const';
import { APPS } from '../const';

export const reducer = combineReducers({
  [APPS]: storage(APPS),
  app: one(APPS, ext('app')),
});
