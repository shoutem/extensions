import { getShortcut } from 'shoutem.application';
import { loadFeed } from 'shoutem.rss';
import {
  DEFAULT_PAGE_LIMIT,
  NEWS_COLLECTION_TAG,
  RSS_NEWS_SCHEMA,
} from '../const';

export function fetchNewsFeed(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
) {
  return (dispatch, getState) => {
    const state = getState();
    const shortcut = getShortcut(state, shortcutId);

    return dispatch(
      loadFeed(RSS_NEWS_SCHEMA, NEWS_COLLECTION_TAG, shortcut, options),
    );
  };
}
