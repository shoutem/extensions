import _ from 'lodash';
import { find } from '@shoutem/redux-io';
import { getExtensionSettings, getShortcut } from 'shoutem.application';
import { buildFeedUrlWithEndpoint, ext as rssExt } from 'shoutem.rss';
import { DEFAULT_PAGE_LIMIT, RSS_VIDEOS_SCHEMA } from '../const';

export function fetchVideosFeed(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      const state = getState();
      const settings = getExtensionSettings(state, rssExt());
      const baseApiEndpoint = _.get(settings, 'baseApiEndpoint');
      const shortcut = getShortcut(state, shortcutId);
      const feedUrl = _.get(shortcut, 'settings.feedUrl');

      const config = {
        schema: RSS_VIDEOS_SCHEMA,
        request: {
          endpoint: buildFeedUrlWithEndpoint(
            baseApiEndpoint,
            RSS_VIDEOS_SCHEMA,
          ),
          headers: {
            Accept: 'application/vnd.api+json',
          },
        },
      };

      resolve(
        dispatch(
          find(config, 'allVideos', {
            query: {
              'filter[url]': feedUrl,
              'page[limit]': options.pageLimit,
            },
          }),
        ),
      );
      // eslint-disable-next-line no-console
    }).catch(err => console.warn('Fetch video feed failed.', err));
  };
}
