import { combineReducers } from 'redux';
import { ext } from 'src/const';
import { collection, storage } from '@shoutem/redux-io';
import { FONTS } from '../const';

export const reducer = combineReducers({
  [FONTS]: storage(FONTS),
  fonts: collection(FONTS, ext('all')),
});
