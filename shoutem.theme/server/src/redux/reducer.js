import { combineReducers } from 'redux';
import { collection, storage } from '@shoutem/redux-io';
import { THEMES_SCHEMA } from '../const';

export default combineReducers({
  themes: storage(THEMES_SCHEMA),
  allThemes: collection(THEMES_SCHEMA, 'allThemes'),
});
