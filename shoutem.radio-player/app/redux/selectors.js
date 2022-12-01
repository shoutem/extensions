import _ from 'lodash';
import { createSelector } from 'reselect';
import { getCollection } from '@shoutem/redux-io';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export const getRadioMetadata = createSelector(
  [getModuleState, (_state, id) => id],
  (moduleState, id) => _.get(moduleState, ['radioMetadata', id], {}),
);

export function getNewsFeed(state, feedUrl) {
  return getCollection(getModuleState(state).latestNews[feedUrl], state);
}
