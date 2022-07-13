import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import webPageReducer, { SHORTCUTS } from './webPage/reducer';

const storageReducer = combineReducers({
  [SHORTCUTS]: storage(SHORTCUTS),
});

export default combineReducers({
  webPage: webPageReducer,
  storage: storageReducer,
});
