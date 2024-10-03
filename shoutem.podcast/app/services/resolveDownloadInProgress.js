import _ from 'lodash';

export const resolveDownloadInProgress = (episodeId, downloadedEpisodes) => {
  return _.find(
    downloadedEpisodes,
    downloadedEpisode => downloadedEpisode.id === episodeId,
  )?.downloadInProgress;
};
