import _ from 'lodash';
import { clear, find, getCollection } from '@shoutem/redux-io';
import { getShortcut } from 'shoutem.application';
import { buildFeedUrl, loadFeed } from 'shoutem.rss';
import { loadNextFeedPage } from 'shoutem.rss/redux';
import {
  DEFAULT_PAGE_LIMIT,
  DOWNLOADED_EPISODE_ADDED,
  DOWNLOADED_EPISODE_REMOVED,
  DOWNLOADED_EPISODE_UPDATED,
  EPISODES_COLLECTION_TAG,
  ext,
  FAVORITED_EPISODES_TAG,
  RSS_PODCAST_SCHEMA,
  SET_DOWNLOAD_IN_PROGRESS,
  UPDATE_LAST_PLAYED,
} from '../const';
import { mapEpisodeToTrack } from '../services';
import {
  episodeDownloadManager,
  getFileNameFromPath,
  getPathFromEpisode,
} from '../services/episodeDownloadManager';
import { getAllFavoritedEpisodesMap, getDownloadedEpisodes } from './selectors';

export const SAVE_FAVORITE_EPISODE = ext('SAVE_FAVORITE_EPISODE');
export const REMOVE_FAVORITE_EPISODE = ext('REMOVE_FAVORITE_EPISODE');

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

export function downloadEpisode(episode) {
  return dispatch => {
    return dispatch(setDownloadInProgress(episode.id)).then(() => {
      const url = _.get(episode, 'audioAttachments.0.src');

      return episodeDownloadManager
        .download(url)
        .then(path => {
          dispatch(addDownloadedEpisode(episode.id, getFileNameFromPath(path)));
        })
        .catch(errorMessage => {
          dispatch(removeDownloadedEpisode(episode.id));
          // eslint-disable-next-line no-console
          console.error('Failed to download podcast episode:', errorMessage);
        });
    });
  };
}

export function deleteEpisode(downloadedEpisode) {
  const path = getPathFromEpisode(downloadedEpisode);

  return dispatch => {
    return episodeDownloadManager
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
  tag = EPISODES_COLLECTION_TAG,
) {
  return (dispatch, getState) => {
    const state = getState();
    const shortcut = getShortcut(state, shortcutId);

    return dispatch(loadFeed(RSS_PODCAST_SCHEMA, tag, shortcut, options));
  };
}

export const updateLastPlayed = (feedUrl, track) => {
  return {
    type: UPDATE_LAST_PLAYED,
    payload: { feedUrl, track },
  };
};

export function loadMoreTracks(collection, feedUrl, defaultArtwork) {
  return async (dispatch, getState) => {
    const denormalizedData = await dispatch(loadNextFeedPage(collection));

    if (!denormalizedData.payload?.data) {
      return [];
    }

    const state = getState();

    const episodes = getCollection(
      _.map(denormalizedData.payload.data, 'id'),
      state,
      RSS_PODCAST_SCHEMA,
    );

    const downloadedEpisodes = getDownloadedEpisodes(state);

    return _.map(episodes, episode =>
      mapEpisodeToTrack(episode, feedUrl, defaultArtwork, downloadedEpisodes),
    );
  };
}

export function loadEpisodes(
  shortcutId,
  options = { pageLimit: DEFAULT_PAGE_LIMIT },
  tag = EPISODES_COLLECTION_TAG,
) {
  return async (dispatch, getState) => {
    const isSearchRequest = !!options.id;

    const episodesFeed = await dispatch(
      fetchEpisodesFeed(shortcutId, options, tag),
    );

    if (!episodesFeed.payload?.data) {
      return [];
    }

    return getCollection(
      isSearchRequest
        ? [_.head(episodesFeed.payload?.data)?.id]
        : _.map(episodesFeed.payload.data, 'id'),
      getState(),
      RSS_PODCAST_SCHEMA,
    );
  };
}

// FAVORITES

export function saveFavoriteEpisode(uuid, shortcutId) {
  return {
    type: SAVE_FAVORITE_EPISODE,
    payload: {
      uuid,
      shortcutId,
    },
  };
}

export function removeFavoriteEpisode(uuid) {
  return {
    type: REMOVE_FAVORITE_EPISODE,
    payload: { uuid },
  };
}

export function fetchFavoritedEpisodes() {
  return (dispatch, getState) => {
    const state = getState();

    // Get map of favorited episodes per shortcut.
    const allFavoritedEpisodesMap = getAllFavoritedEpisodesMap(state);

    // When all favorites have been removed, we have to clear collection reducer, because
    // we won't be fetching
    if (_.keys(allFavoritedEpisodesMap).length === 0) {
      return Promise.resolve(
        dispatch(clear(RSS_PODCAST_SCHEMA, FAVORITED_EPISODES_TAG)),
      );
    }

    const config = {
      schema: RSS_PODCAST_SCHEMA,
      request: {
        endpoint: buildFeedUrl(state, RSS_PODCAST_SCHEMA),
        headers: {
          Accept: 'application/vnd.api+json',
          // Has to be defined as empty string, to override CMS's generic resourceConfigResolver. It appends 'Content-Type': 'application/vnd.api+json',
          // which breaks our rss proxy - RIO find requests -> https://fiveminutes.jira.com/browse/SEEXT-11781
          'Content-Type': '',
        },
      },
    };

    const episodesFetchActions = [];

    // Clear all favorites, we'll (re)fetch them with this action.
    dispatch(clear(RSS_PODCAST_SCHEMA, FAVORITED_EPISODES_TAG));

    // For each different shortcut favorites, obtain feed url, then fetch filtered - favorited episodes from each feed.
    // Then, append episodes from each feedUrl into collection.
    _.forEach(allFavoritedEpisodesMap, (uuids, shortcutId) => {
      // If all favorites have been removed for shortcut, clear that collections reducer.
      if (uuids.length === 0) {
        // No favorite episodes for this shortcut to fetch. We have to return early, because if we pass [] as
        // filter, we'll get all feed episodes as result.
        return;
      }

      const feedUrl = getShortcut(state, shortcutId)?.settings?.feedUrl;

      // Create array of promises that'll return all favorited episodes from all feed urls at same time.
      episodesFetchActions.push(
        dispatch(
          find(
            config,
            FAVORITED_EPISODES_TAG,
            {
              query: {
                'filter[url]': feedUrl,
                'filter[uuid]': uuids,
                'page[limit]': DEFAULT_PAGE_LIMIT,
              },
            },
            { shortcutId },
          ),
        ),
      );
    });

    return Promise.allSettled(episodesFetchActions);
  };
}
