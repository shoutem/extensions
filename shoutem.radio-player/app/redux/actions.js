import { getShortcut } from 'shoutem.application';
import { loadFeed } from 'shoutem.rss';

export const DEFAULT_PAGE_LIMIT = 20;
export const RSS_NEWS_SCHEMA = 'shoutem.proxy.news';
export const NEWS_COLLECTION_TAG = 'latestNews';

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
