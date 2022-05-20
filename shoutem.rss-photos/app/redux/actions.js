import { getShortcut } from 'shoutem.application';
import { loadFeed } from 'shoutem.rss';
import {
  DEFAULT_PAGE_LIMIT,
  PHOTOS_COLLECTION_TAG,
  RSS_PHOTOS_SCHEMA,
} from '../const';

export function fetchPhotosFeed(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
) {
  return (dispatch, getState) => {
    const state = getState();
    const shortcut = getShortcut(state, shortcutId);

    return dispatch(
      loadFeed(RSS_PHOTOS_SCHEMA, PHOTOS_COLLECTION_TAG, shortcut, options),
    );
  };
}
