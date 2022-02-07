import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { cmsCollection } from 'shoutem.cms';
import { ext } from '../const';

export default combineReducers({
  places: storage(ext('places')),
  allPlaces: cmsCollection(ext('places')),
});
