import _ from 'lodash';
import { combineReducers } from 'redux';
import { mapReducers } from '@shoutem/redux-composers';
import { collection, storage } from '@shoutem/redux-io';
import { cmsCollection } from 'shoutem.cms';
import { DEALS_SCHEMA, ext } from '../const';

function getPlaceId(action) {
  return _.get(action, ['meta', 'params', 'query', 'filter[place.id]']);
}

export default combineReducers({
  places: storage(ext('places')),
  allPlaces: cmsCollection(ext('places')),
  placeDeals: mapReducers(getPlaceId, () =>
    collection(DEALS_SCHEMA, ext('deals')),
  ),
});
