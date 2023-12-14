import { ext } from 'src/const';
import { getCollection } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getCategoriesState(state) {
  return state[ext()][moduleName];
}

export function getAppCategories(state) {
  const { app } = getCategoriesState(state);
  return getCollection(app, state);
}
