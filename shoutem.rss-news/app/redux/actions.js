import { find } from '@shoutem/redux-io';
import { getExtensionSettings, getShortcut } from 'shoutem.application';
import { buildFeedUrlWithEndpoint, ext as rssExt } from 'shoutem.rss';
import { DEFAULT_PAGE_LIMIT, RSS_NEWS_SCHEMA } from '../const';

export function fetchNewsFeed(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      const state = getState();
      const { baseApiEndpoint } = getExtensionSettings(state, rssExt());
      const shortcut = getShortcut(state, shortcutId);
      const feedUrl = shortcut?.settings?.feedUrl;

      const config = {
        schema: RSS_NEWS_SCHEMA,
        request: {
          endpoint: buildFeedUrlWithEndpoint(baseApiEndpoint, RSS_NEWS_SCHEMA),
          headers: {
            Accept: 'application/vnd.api+json',
          },
        },
      };

      resolve(
        dispatch(
          find(config, 'latestNews', {
            query: {
              'filter[url]': feedUrl,
              'page[limit]': options.pageLimit,
            },
          }),
        ),
      );
    });
  };
}
