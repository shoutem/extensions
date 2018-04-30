import { getCollection } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getDealsState(state) {
  return state[moduleName];
}

export function getDeals(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const deals = getDealsState(shortcutState).deals;
  return getCollection(deals, state);
}

export function getDealCategories(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const categories = getDealsState(shortcutState).categories;
  return getCollection(categories, state);
}

export function getPlaces(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const places = getDealsState(shortcutState).places;
  return getCollection(places, state);
}
