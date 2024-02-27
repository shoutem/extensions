import { getCollection } from '@shoutem/redux-io';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getNewsFeed(state, feedUrl) {
  return getCollection(getModuleState(state).latestNews[feedUrl], state);
}
