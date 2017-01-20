import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { CATEGORIES, SCHEMAS, CURRENT_SCHEMA } from './types';
import cmsPage from './cmsPage/reducer';

const storageReducer = combineReducers({
  [CATEGORIES]: storage(CATEGORIES),
  [SCHEMAS]: storage(SCHEMAS),
  [CURRENT_SCHEMA]: storage(CURRENT_SCHEMA),
});

export default combineReducers({
  storage: storageReducer,
  cmsPage,
});
