import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { rssFeed } from 'shoutem.rss';
import { RSS_VIDEOS_SCHEMA } from '../const';

export default combineReducers({
  videos: storage(RSS_VIDEOS_SCHEMA),
  allVideos: rssFeed(RSS_VIDEOS_SCHEMA, 'allVideos'),
});
