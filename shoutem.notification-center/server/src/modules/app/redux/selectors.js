import ext from 'src/const';
import { getOne } from '@shoutem/redux-io';
import { moduleName } from '../const';

function getAppState(state) {
  return state[ext()][moduleName];
}

export function getApplicationStatus(state) {
  const app = getAppState(state);
  return getOne(app.applicationStatus, state);
}
