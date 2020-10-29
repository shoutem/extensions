import { combineReducers } from 'redux';
import { CATEGORIES } from '@shoutem/cms-dashboard';
import { collection } from '@shoutem/redux-io';
import { ext } from 'src/const';
import { types } from 'src/services';

export const reducer = () =>
  combineReducers({
    deals: collection(types.DEALS, ext('deals')),
    places: collection(types.PLACES, ext('places')),
    categories: collection(CATEGORIES, ext('categories')),
  });
