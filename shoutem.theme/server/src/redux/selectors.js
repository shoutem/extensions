import { getCollection } from '@shoutem/redux-io';
import { ext } from '../const';

function getExtensionState(state) {
  return state[ext()];
}

export function getThemes(state) {
  return getCollection(getExtensionState(state).allThemes, state);
}
