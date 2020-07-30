import { getOne } from '@shoutem/redux-io';
import ext from '../../../const';
import { moduleName } from '../const';

function getRssState(state) {
  return state[ext()][moduleName];
}

export function getRssMonitor(state) {
  const rss = getRssState(state);
  return getOne(rss.rssMonitor, state);
}
