import { ext } from 'src/const';
import { getCollection } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getFontsState(state) {
  return state[ext()][moduleName];
}

export function getAllFonts(state) {
  const { fonts } = getFontsState(state);
  return getCollection(fonts, state);
}
