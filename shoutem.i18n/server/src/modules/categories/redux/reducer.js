import { combineReducers } from 'redux';
import { ext } from 'src/const';
import { collection, storage } from '@shoutem/redux-io';
import { CATEGORIES } from '../const';

export default combineReducers({
  [CATEGORIES]: storage(CATEGORIES),
  app: collection(CATEGORIES, ext('app-categories')),
});
