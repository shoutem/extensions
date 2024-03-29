import _ from 'lodash';
import { getShortcut } from 'shoutem.application';
import { getActivePlaylistOrStream } from 'shoutem.audio';
import { loadFeed } from 'shoutem.rss';
import {
  DEFAULT_PAGE_LIMIT,
  DOWNLOADED_EPISODE_ADDED,
  DOWNLOADED_EPISODE_REMOVED,
  DOWNLOADED_EPISODE_UPDATED,
  EPISODES_COLLECTION_TAG,
  ext,
  RSS_PODCAST_SCHEMA,
  SET_DOWNLOAD_IN_PROGRESS,
  UPDATE_LAST_PLAYED,
} from '../const';
import {
  episodeDownloadManager,
  getFileNameFromPath,
  getPathFromEpisode,
} from '../services/episodeDownloadManager';
import { getEpisodesFeed } from './selectors';

export const FAVORITE_EPISODE = ext('FAVORITE_EPISODE');
export const UNFAVORITE_EPISODE = ext('UNFAVORITE_EPISODE');

export function addDownloadedEpisode(id, fileName) {
  return { type: DOWNLOADED_EPISODE_ADDED, payload: { id, fileName } };
}

export function removeDownloadedEpisode(id) {
  return { type: DOWNLOADED_EPISODE_REMOVED, payload: { id } };
}

export function setDownloadInProgress(id) {
  return { type: SET_DOWNLOAD_IN_PROGRESS, payload: { id } };
}

// Used to replace 'path' with 'fileName' for 'downloadedEpisode's to allow
// backwards compatibility.
export function updateDownloadedEpisode(downloadedEpisode) {
  return { type: DOWNLOADED_EPISODE_UPDATED, payload: { downloadedEpisode } };
}

export function downloadEpisode(id, feedUrl) {
  return (dispatch, getState) => {
    dispatch(setDownloadInProgress(id)).then(() => {
      const state = getState();
      const episodes = getEpisodesFeed(state, feedUrl);
      const episode = _.find(episodes, { id });
      const url = _.get(episode, 'audioAttachments.0.src');

      return episodeDownloadManager
        .download(url)
        .then(path => {
          dispatch(addDownloadedEpisode(id, getFileNameFromPath(path)));
        })
        .catch(errorMessage => {
          dispatch(removeDownloadedEpisode(id));
          // eslint-disable-next-line no-console
          console.error('Failed to download podcast episode:', errorMessage);
        });
    });
  };
}

export function deleteEpisode(downloadedEpisode) {
  const path = getPathFromEpisode(downloadedEpisode);

  return dispatch => {
    episodeDownloadManager
      .remove(path)
      .catch(error => {
        // eslint-disable-next-line no-console
        console.error('Error removing downloaded episode:', error);
      })
      .finally(() => dispatch(removeDownloadedEpisode(downloadedEpisode.id)));
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

export function favoriteEpisode(episode, enableDownload, feedUrl, meta) {
  return {
    type: FAVORITE_EPISODE,
    payload: {
      episode: { ...episode, enableDownload, feedUrl, feedMeta: meta },
    },
  };
}

export function unfavoriteEpisode(id) {
  return { type: UNFAVORITE_EPISODE, payload: { id } };
}

export const updateLastPlayed = (feedUrl, track) => {
  return {
    type: UPDATE_LAST_PLAYED,
    payload: { feedUrl, track },
  };
};

export const clearLastPlayed = () => (dispatch, getState) => {
  const state = getState();
  const activePlaylist = getActivePlaylistOrStream(state);

  dispatch(updateLastPlayed(activePlaylist.id, null));
};
