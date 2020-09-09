import _ from 'lodash';
import { find } from '@shoutem/redux-io';
import { buildFeedUrlWithEndpoint, ext as rssExt } from 'shoutem.rss';
import { getExtensionSettings, getShortcut } from 'shoutem.application';
import { RSS_PODCAST_SCHEMA } from '../const';

export function fetchEpisodesFeed(shortcutId) {
  return (dispatch, getState) => {
    return new Promise((resolve) => {
      const state = getState();
      const settings = getExtensionSettings(state, rssExt());
      const baseApiEndpoint = _.get(settings, 'baseApiEndpoint');
      const shortcut = getShortcut(state, shortcutId);
      const feedUrl = _.get(shortcut, 'settings.feedUrl');

      const config = {
        schema: RSS_PODCAST_SCHEMA,
        request: {
          endpoint: buildFeedUrlWithEndpoint(
            baseApiEndpoint,
            RSS_PODCAST_SCHEMA,
          ),
          headers: {
            Accept: 'application/vnd.api+json',
          },
        },
      };

      resolve(
        dispatch(
          find(config, 'latestEpisodes', {
            query: {
              'filter[url]': feedUrl,
            },
          }),
        ),
      );
    });
  };
}
