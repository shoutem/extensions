import _ from 'lodash';
import { buildFeedUrlWithEndpoint, ext as rssExt } from 'shoutem.rss';
import { getExtensionSettings, getShortcut } from 'shoutem.application';
import { find } from '@shoutem/redux-io';
import {
  DOWNLOADED_EPISODE_ADDED,
  DOWNLOADED_EPISODE_REMOVED,
  RSS_PODCAST_SCHEMA,
  SET_DOWNLOAD_IN_PROGRESS,
} from '../const';
import { episodeDownloadManager } from '../services';
import { getDownloadedEpisode, getEpisodesFeed } from './selectors';

export function addDownloadedEpisode(path, id) {
  return { type: DOWNLOADED_EPISODE_ADDED, payload: { id, path } };
}

export function removeDownloadedEpisode(id) {
  return { type: DOWNLOADED_EPISODE_REMOVED, payload: { id } };
}

export function setDownloadInProgress(id) {
  return { type: SET_DOWNLOAD_IN_PROGRESS, payload: { id } };
}

export function downloadEpisode(id, feedUrl) {
  return (dispatch, getState) => {
    dispatch(setDownloadInProgress(id)).then(() => {
      const state = getState();
      const episodes = getEpisodesFeed(state, feedUrl);
      const episode = _.find(episodes, { id });
      const url = _.get(episode, 'audioAttachments.0.src');

      episodeDownloadManager
        .download(url)
        .then(path => {
          dispatch(addDownloadedEpisode(path, id));
        })
        .catch(errorMessage => {
          dispatch(removeDownloadedEpisode(id));
          // eslint-disable-next-line no-console
          console.error('Failed to download podcast episode:', errorMessage);
        });
    });
  };
}

export function deleteEpisode(id, path) {
  return dispatch => {
    episodeDownloadManager
      .remove(path)
      .then(() => dispatch(removeDownloadedEpisode(id)))
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error removing downloaded episode:', error);
      });
  };
}

export function fetchEpisodesFeed(shortcutId) {
  return (dispatch, getState) => {
    return new Promise(resolve => {
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
