import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { rssFeed } from 'shoutem.rss';
import { RSS_PODCAST_SCHEMA } from '../const';

export default combineReducers({
  episodes: storage(RSS_PODCAST_SCHEMA),
  latestEpisodes: rssFeed(RSS_PODCAST_SCHEMA, 'latestEpisodes'),
});
