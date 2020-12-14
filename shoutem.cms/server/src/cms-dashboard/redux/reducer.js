import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { reducer as formReducer } from 'redux-form';
import { CATEGORIES, SCHEMAS } from '../const';

// REDUCER
export const reducer = combineReducers({
  form: formReducer,
  [SCHEMAS]: storage(SCHEMAS),
  [CATEGORIES]: storage(CATEGORIES),
});
