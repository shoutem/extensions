import _ from 'lodash';
import { getCollection } from '@shoutem/redux-io';
import { getShortcut } from 'shoutem.application';
import { ext, getEpisodeTrackId } from '../const';
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

export function getEpisodesFeedWithDownloads(state, feedUrl) {
  const latestEpisodes = getEpisodesFeed(state, feedUrl);
  const downloadedEpisodes = getDownloadedEpisodes(state);

  const episodesFeed = latestEpisodes.map(episode => {
    const downloadedEpisode = downloadedEpisodes.find(
      downloadedEpisode => downloadedEpisode.id === episode.id,
    );

    if (downloadedEpisode) {
      return { ...episode, ...downloadedEpisode };
    }

    return episode;
  });

  return episodesFeed;
}

export function getFeedUrl(state, shortcutId) {
  const shortcut = getShortcut(state, shortcutId);

  return _.get(shortcut, 'settings.feedUrl');
}

export function getFavoritedEpisodes(state) {
  return state[ext()].favoritedEpisodes;
}

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

export function getIsFavorited(state, id) {
  const favoritedEpisodes = getFavoritedEpisodes(state);
  const favoritedEpisode = favoritedEpisodes.find(episode => episode.id === id);

  return !!favoritedEpisode;
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
