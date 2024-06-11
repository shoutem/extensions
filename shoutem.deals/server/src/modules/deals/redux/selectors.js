import { getCollection } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getDealsState(state) {
  return state[moduleName];
}

export function getDeals(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const { deals } = getDealsState(shortcutState);
  return getCollection(deals, state);
}

export function getDealCategories(shortcutState, state) {
  if (!shortcutState) {
    return null;
  }

  const { categories } = getDealsState(shortcutState);
  return getCollection(categories, state);
}
