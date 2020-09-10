import _ from 'lodash';
import { getShortcut } from 'shoutem.application';
import { getCollection } from '@shoutem/redux-io';
import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}

export function getEpisodesFeed(state, feedUrl) {
  return getCollection(getModuleState(state).latestEpisodes[feedUrl], state);
}

export function getFeedUrl(state, shortcutId) {
  const shortcut = getShortcut(state, shortcutId);
  return _.get(shortcut, 'settings.feedUrl');
}
