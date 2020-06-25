import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import faqReducer, { SHORTCUTS } from './pages/reducer';

const storageReducer = combineReducers({
  [SHORTCUTS]: storage(SHORTCUTS),
});

export default combineReducers({
  faq: faqReducer,
  storage: storageReducer,
});
