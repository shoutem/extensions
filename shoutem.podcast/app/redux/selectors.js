import _ from 'lodash';
import {
  getCollection,
  getMeta,
  getOne,
  isBusy,
  isInitialized,
} from '@shoutem/redux-io';
import { getShortcut } from 'shoutem.application';
import { EPISODE_TAG, ext, getEpisodeTrackId } from '../const';
import { getPathFromEpisode } from '../services';

function getModuleState(state) {
  return state[ext()];
}

export function getDownloadedEpisodes(state) {
  return getModuleState(state).downloadedEpisodes;
}

export function getDownloadedEpisode(state, id) {
  return getDownloadedEpisodes(state).find(episode => episode.id === id);
}

export function getEpisodesFeed(state, feedUrl) {
  return getCollection(getModuleState(state).latestEpisodes[feedUrl], state);
}

export function getFeedMetaForOneEpisode(state) {
  const episode = getOne(getModuleState(state)[EPISODE_TAG], state);

  return getMeta(episode);
}

export function getFeedUrl(state, shortcutId) {
  const shortcut = getShortcut(state, shortcutId);

  return _.get(shortcut, 'settings.feedUrl');
}

export const getEpisodeTrack = (state, episode, artwork) => {
  const downloadedEpisode = getDownloadedEpisode(state, episode.id);

  const id = getEpisodeTrackId(episode.id);
  const audioFileUrl = episode.audioAttachments?.[0]?.src;
  const resolvedUrl = downloadedEpisode
    ? `file://${getPathFromEpisode(downloadedEpisode)}`
    : audioFileUrl;

  return {
    id,
    url: resolvedUrl,
    extensionCanonicalName: ext(),
    title: episode.title,
    artist: episode.author ?? '',
    artwork,
  };
};

export const getLastPlayed = (state, feedUrl) => {
  return getModuleState(state).lastPlayed[feedUrl];
};

// **** FAVORITES ****

/**
 * Returns the shortcut ID - array of favorite episode IDs map.
 * This is always up-to-date map of favorited episode IDs.
 * @returns Array of `{shortcutId: favoriteEpisode[]}`
 */
export function getAllFavoritedEpisodesMap(state) {
  return state[ext()].favoritedEpisodes;
}

/**
 *  Returns collection - single shortcut favorite episodes data (full episode data).
 * @param {*} state
 * @param {*} shortcutId
 * @returns Array of `episode`
 */
export function getFavoriteEpisodesCollection(state, shortcutId) {
  return getCollection(
    getModuleState(state).favoritedEpisodesCollection[shortcutId],
    state,
  );
}

/**
 * Returns multiple collections - multiple shortcut favorite episodes data (full episode data),
 * inside a single array.
 * @param {*} state
 * @returns Array of `episode`
 */
export function getAllFavoriteEpisodes(state) {
  const allFavoritesShortcutIds = _.keys(
    getModuleState(state).favoritedEpisodesCollection,
  );

  return _.reduce(
    allFavoritesShortcutIds,
    (result, shortcutId) => {
      const favorites = getFavoriteEpisodesCollection(state, shortcutId);
      return [...result, ...favorites];
    },
    [],
  );
}

//

/**
 * Returns array of full favorite episodes data, per shortcut.
 * @param {*} state 
 * @returns Array of `{ shortcut, favorites, meta }`

 */
export function getAllFavoritesData(state) {
  const allFavoritesShortcutIds = _.keys(
    getModuleState(state).favoritedEpisodesCollection,
  );

  return _.reduce(
    allFavoritesShortcutIds,
    (result, shortcutId) => {
      const shortcut = getShortcut(state, shortcutId);
      const favorites = getFavoriteEpisodesCollection(state, shortcutId);
      const meta = getShortcutFeedMeta(state, shortcutId);

      return [
        ...result,
        {
          favorites,
          shortcut,
          meta,
        },
      ];
    },
    [],
  );
}

// Returns feed meta data for provided shortcut
export function getShortcutFeedMeta(state, shortcutId) {
  return getMeta(getModuleState(state).favoritedEpisodesCollection[shortcutId]);
}

/**
 * Returns boolean defining if application Podcast favorite shortcut added into application
 */
export function getHasFavorites(state) {
  const { shortcuts } = state['shoutem.application'];

  const shortcutIds = Object.keys(shortcuts);
  const podcastFavoriteShortcuts = [];

  shortcutIds.forEach(shortcutId => {
    const {
      attributes: { canonicalName },
    } = shortcuts[shortcutId];

    if (
      canonicalName === ext('MyPodcastsScreen') ||
      canonicalName === ext('MyPodcastsWithoutShareScreen')
    ) {
      podcastFavoriteShortcuts.push(shortcutId);
    }
  });

  return !!podcastFavoriteShortcuts.length;
}

/**
 * Returns boolean defining if provided episode is favorited.
 */
export function getIsFavorited(state, uuid) {
  const favoriteEpisodesMap = getModuleState(state).favoritedEpisodes;

  // Look for given uuid in all favorites. Exit early if found and return true, otherwise false.
  return _.some(favoriteEpisodesMap, shortcutFavorites =>
    _.some(shortcutFavorites, favoriteUuid => favoriteUuid === uuid),
  );
}

/**
 * Gets feed meta for all shortcuts that have favorite episode and checks if any of
 * them is in loading state.
 */
export function getFavoriteEpisodesLoading(state) {
  const allFavoritesShortcutIds = _.keys(
    getModuleState(state).favoritedEpisodesCollection,
  );

  return _.some(allFavoritesShortcutIds, shortcutId => {
    const collection = getFavoriteEpisodesCollection(state, shortcutId);

    return isBusy(collection || !isInitialized(collection));
  });
}
