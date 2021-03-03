import { combineReducers } from 'redux';
import { rssFeed } from 'shoutem.rss';
import { storage } from '@shoutem/redux-io';
import { RSS_NEWS_SCHEMA } from '../const';

export default combineReducers({
  news: storage(RSS_NEWS_SCHEMA),
  latestNews: rssFeed(RSS_NEWS_SCHEMA, 'latestNews'),
});
