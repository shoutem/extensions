import { loadFeed } from 'shoutem.rss';
import {
  DEFAULT_PAGE_LIMIT,
  RSS_VIDEOS_SCHEMA,
  VIDEOS_COLLECTION_TAG,
} from '../const';

export function fetchVideosFeed(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
) {
  return dispatch =>
    dispatch(
      loadFeed(RSS_VIDEOS_SCHEMA, VIDEOS_COLLECTION_TAG, shortcutId, options),
    );
}
