import { storage, collection } from '@shoutem/redux-io';
import { combineReducers } from 'redux';
import { ext } from '../const';

export const SHOUTEM_CATEGORIES_SCHEME = 'shoutem.core.categories';


export default combineReducers({
  places: storage(ext('places')),
  allPlaces: collection(ext('places'), 'all'),
  categories: storage(SHOUTEM_CATEGORIES_SCHEME),
  placeCategories: collection(SHOUTEM_CATEGORIES_SCHEME, 'placeCategories')
});