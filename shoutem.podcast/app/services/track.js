import { Platform } from 'react-native';
import slugify from '@sindresorhus/slugify';
import { PODCAST_TRACK_IDENTIFIER } from '../const';
import { getPathFromEpisode } from './episodeDownloadManager';

export const getTrackId = (id, url) =>
  `${PODCAST_TRACK_IDENTIFIER}-${id ?? slugify(url)}`;

const create = (
  url,
  episode,
  artwork,
  downloadedEpisode,
  updateDownloadedEpisode,
) => {
  const { author = '', title } = episode;

  // Whenever an episode is played, we check for a path and update
  if (downloadedEpisode && downloadedEpisode.path && Platform.OS === 'ios') {
    updateDownloadedEpisode(downloadedEpisode);
  }

  const id = getTrackId(episode.id, episode.url);

  const resolvedUrl = downloadedEpisode
    ? `file://${getPathFromEpisode(downloadedEpisode)}`
    : url;

  return {
    id,
    url: resolvedUrl,
    title,
    artist: author,
    artwork,
  };
};

export const Track = { create };
