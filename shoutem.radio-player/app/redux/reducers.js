import _ from 'lodash';
import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { preventStateRehydration } from 'shoutem.redux';
import { rssFeed } from 'shoutem.rss';

export const RSS_NEWS_SCHEMA = 'shoutem.proxy.news';
export const NEWS_COLLECTION_TAG = 'latestNews';

export default preventStateRehydration(
  combineReducers({
    news: storage(RSS_NEWS_SCHEMA),
    latestNews: rssFeed(RSS_NEWS_SCHEMA, NEWS_COLLECTION_TAG),
  }),
);
