import { getOne } from '@shoutem/redux-io';
import ext from '../../../const';
import { moduleName } from '../const';

function getAppState(state) {
  return state[ext()][moduleName];
}

export function getApplicationStatus(state) {
  const app = getAppState(state);
  return getOne(app.applicationStatus, state);
}
