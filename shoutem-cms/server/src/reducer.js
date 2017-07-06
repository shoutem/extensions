import { combineReducers } from 'redux';
import { storage, one, collection } from '@shoutem/redux-io';
import { CATEGORIES, SCHEMAS, CURRENT_SCHEMA } from './types';
import { ext } from 'context';

const storageReducer = combineReducers({
  [CATEGORIES]: storage(CATEGORIES),
  [SCHEMAS]: storage(SCHEMAS),
  [CURRENT_SCHEMA]: storage(CURRENT_SCHEMA),
});

const cmsPage = combineReducers({
  categories: collection(CATEGORIES, ext('all')),
  schema: one(SCHEMAS, ext('schema')),
  resources: collection(CURRENT_SCHEMA, ext('all')),
});

export default combineReducers({
  storage: storageReducer,
  cmsPage,
});
