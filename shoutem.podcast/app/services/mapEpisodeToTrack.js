import _ from 'lodash';
import { getLeadImageUrl } from 'shoutem.rss';
import { ext, getEpisodeTrackId } from '../const';
import { getPathFromEpisode } from './episodeDownloadManager';

const resolveEpisodeSource = (downloadedEpisodes, episode) => {
  const downloadedEpisode = _.find(downloadedEpisodes, { id: episode.id });

  if (downloadedEpisode) {
    return `file://${getPathFromEpisode(downloadedEpisode)}`;
  }

  return episode.audioAttachments?.[0]?.src;
};

export const mapEpisodeToTrack = (
  episode,
  feedUrl,
  defaultArtwork,
  downloadedEpisodes,
) => {
  return {
    id: getEpisodeTrackId(episode.id),
    url: resolveEpisodeSource(downloadedEpisodes, episode),
    playlistOrStreamUrl: feedUrl,
    extensionCanonicalName: ext(),
    title: episode.title,
    artist: episode.author ?? '',
    artwork: getLeadImageUrl(episode) ?? defaultArtwork,
  };
};
