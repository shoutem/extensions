import { find } from '@shoutem/redux-io';
import { getExtensionSettings, getShortcut } from 'shoutem.application';
import { buildFeedUrlWithEndpoint, ext as rssExt } from 'shoutem.rss';
import { DEFAULT_PAGE_LIMIT, RSS_PHOTOS_SCHEMA } from '../const';

export function fetchPhotosFeed(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      const state = getState();
      const settings = getExtensionSettings(state, rssExt());
      const { baseApiEndpoint } = settings;
      const shortcut = getShortcut(state, shortcutId);
      const feedUrl = shortcut?.settings?.feedUrl;

      const config = {
        schema: RSS_PHOTOS_SCHEMA,
        request: {
          endpoint: buildFeedUrlWithEndpoint(
            baseApiEndpoint,
            RSS_PHOTOS_SCHEMA,
          ),
          headers: {
            Accept: 'application/vnd.api+json',
          },
        },
      };

      resolve(
        dispatch(
          find(config, 'allPhotos', {
            query: {
              'filter[url]': feedUrl,
              'page[limit]': options.pageLimit,
            },
          }),
        ),
      );
      // eslint-disable-next-line no-console
    }).catch(err => console.warn('Fetch photo feed failed.', err));
  };
}
