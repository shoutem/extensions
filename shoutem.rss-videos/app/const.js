// This file is auto-generated.
import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const DEFAULT_PAGE_LIMIT = 20;
export const VIDEOS_SCHEMA_ITEM = 'Video';
export const VIDEO_DETAILS_SCREEN = ext('VideoDetails');
export const VIDEOS_LIST_SCREEN = ext('VideosList');
export const RSS_VIDEOS_SCHEMA = 'shoutem.proxy.videos';
export const VIDEOS_COLLECTION_TAG = 'allVideos';
