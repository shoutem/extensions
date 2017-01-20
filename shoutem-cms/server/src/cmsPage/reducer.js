import { combineReducers } from 'redux';
import { one, collection } from '@shoutem/redux-io';
import { ext } from 'context';
import { CATEGORIES, SCHEMAS, CURRENT_SCHEMA } from './../types';

export default combineReducers({
  categories: collection(CATEGORIES, ext('all')),
  schema: one(SCHEMAS, ext('schema')),
  resources: collection(CURRENT_SCHEMA, ext('all')),
});
