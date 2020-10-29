import { combineReducers } from 'redux';
import rssPageReducer, {
  DISCOVERED_FEEDS,
  FEED_ITEMS,
} from './pages/rssPage/reducer';
import { storage } from '@shoutem/redux-io';

const storageReducer = combineReducers({
  [DISCOVERED_FEEDS]: storage(DISCOVERED_FEEDS),
  [FEED_ITEMS]: storage(FEED_ITEMS),
});

export default combineReducers({
  rssPage: rssPageReducer,
  storage: storageReducer,
});
