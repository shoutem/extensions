import _ from 'lodash';
import { getExtensionSettings, getShortcut } from 'shoutem.application';
import { buildFeedUrlWithEndpoint, ext as rssExt } from 'shoutem.rss';
import { find } from '@shoutem/redux-io';
import { RSS_PHOTOS_SCHEMA } from '../const';

export function fetchPhotosFeed(shortcutId) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
      const state = getState();
      const settings = getExtensionSettings(state, rssExt());
      const baseApiEndpoint = _.get(settings, 'baseApiEndpoint');
      const shortcut = getShortcut(state, shortcutId);
      const feedUrl = _.get(shortcut, 'settings.feedUrl');

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
            },
          }),
        ),
      );
    }).catch(err => console.warn('Fetch photo feed failed.', err));
  };
}
