import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { rssFeed } from 'shoutem.rss';
import { NEWS_COLLECTION_TAG, RSS_NEWS_SCHEMA } from '../const';

export default combineReducers({
  news: storage(RSS_NEWS_SCHEMA),
  latestNews: rssFeed(RSS_NEWS_SCHEMA, NEWS_COLLECTION_TAG),
});
