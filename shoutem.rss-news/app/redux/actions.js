import _ from 'lodash';
import { find } from '@shoutem/redux-io';
import { buildFeedUrlWithEndpoint, ext as rssExt } from 'shoutem.rss';
import { getExtensionSettings, getShortcut } from 'shoutem.application';
import { RSS_NEWS_SCHEMA } from '../const';

export function fetchNewsFeed(shortcutId) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      const state = getState();
      const settings = getExtensionSettings(state, rssExt());
      const baseApiEndpoint = _.get(settings, 'baseApiEndpoint');
      const shortcut = getShortcut(state, shortcutId);
      const feedUrl = _.get(shortcut, 'settings.feedUrl');

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
            },
          }),
        ),
      );
    });
  };
}
