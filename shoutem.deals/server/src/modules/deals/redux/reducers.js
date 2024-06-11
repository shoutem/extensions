import { combineReducers } from 'redux';
import { ext } from 'src/const';
import { types } from 'src/services';
import { CATEGORIES } from '@shoutem/cms-dashboard';
import { collection } from '@shoutem/redux-io';

export const reducer = () =>
  combineReducers({
    deals: collection(types.DEALS, ext('deals')),
    categories: collection(CATEGORIES, ext('categories')),
  });
