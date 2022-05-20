import { combineReducers } from 'redux';
import { getCollection, storage } from '@shoutem/redux-io';
import { rssFeed } from 'shoutem.rss';
import { ext, VIMEO_COLLECTION_TAG } from './const';

export const VIMEO_SCHEMA = 'shoutem.proxy.videos';

export default combineReducers({
  videos: storage(VIMEO_SCHEMA),
  allVideos: rssFeed(VIMEO_SCHEMA, VIMEO_COLLECTION_TAG),
});

export function getVimeoFeed(state, feedUrl) {
  return getCollection(state[ext()][VIMEO_COLLECTION_TAG][feedUrl], state);
}
