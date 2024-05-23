import { getCollection } from '@shoutem/redux-io';
import { ext } from '../const';

export function getAllPlaces(state) {
  return state[ext()].allPlaces;
}

export function getPlaceDeals(state, placeId) {
  return getCollection(state[ext()].placeDeals[placeId], state);
}
