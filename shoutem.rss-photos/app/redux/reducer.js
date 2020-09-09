import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { rssFeed } from 'shoutem.rss';
import { RSS_PHOTOS_SCHEMA } from '../const';

export default combineReducers({
  photos: storage(RSS_PHOTOS_SCHEMA),
  allPhotos: rssFeed(RSS_PHOTOS_SCHEMA, 'allPhotos'),
});
