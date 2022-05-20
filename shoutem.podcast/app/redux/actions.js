import _ from 'lodash';
import { getShortcut } from 'shoutem.application';
import { loadFeed } from 'shoutem.rss';
import {
  DEFAULT_PAGE_LIMIT,
  DOWNLOADED_EPISODE_ADDED,
  DOWNLOADED_EPISODE_REMOVED,
  EPISODES_COLLECTION_TAG,
  RSS_PODCAST_SCHEMA,
  SET_DOWNLOAD_IN_PROGRESS,
} from '../const';
import { episodeDownloadManager } from '../services';
import { getEpisodesFeed } from './selectors';

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

export function fetchEpisodesFeed(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
) {
  return (dispatch, getState) => {
    const state = getState();
    const shortcut = getShortcut(state, shortcutId);

    return dispatch(
      loadFeed(RSS_PODCAST_SCHEMA, EPISODES_COLLECTION_TAG, shortcut, options),
    );
  };
}
