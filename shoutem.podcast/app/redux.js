import { combineReducers } from 'redux';
import { storage, getCollection } from '@shoutem/redux-io';

import { rssFeed } from 'shoutem.rss';

import { ext } from './const';

// We're using the news schema as it works fine with podcasts too
export const RSS_PODCAST_SCHEMA = 'shoutem.proxy.news';

export default combineReducers({
  episodes: storage(RSS_PODCAST_SCHEMA),
  latestEpisodes: rssFeed(RSS_PODCAST_SCHEMA),
});

export function getEpisodesFeed(state, feedUrl) {
  return getCollection(state[ext()].latestEpisodes[feedUrl], state);
}
