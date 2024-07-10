import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getActiveSource } from 'shoutem.audio';
import { useLayoutAnimation } from 'shoutem.layouts';
import { PlayPodcastButton } from '../components';
import { useLoadQueue, usePodcastPlaylistPlayer } from '../hooks';
import { getDownloadedEpisodes, getLastPlayed } from '../redux';
import { mapEpisodeToTrack } from '../services';

/**
 * Fragment rendering UI & managining playback of all episodes in the Podcast feed.
 * On mount, checks last played episode, loads all feed episodes before last played,
 * sets up audio queue and only then, shows UI allowing users to start Podcast feed playback.
 * Loading more episodes from anywhere will sync data in collection & audio player's queue.
 */
const PodcastPlaylistPlayer = ({ data, title, meta, shortcutId }) => {
  const { feedUrl, imageUrl: defaultArtwork } = meta;

  const activeSource = useSelector(getActiveSource);
  const downloadedEpisodes = useSelector(getDownloadedEpisodes);
  const lastPlayedEpisodeTrack = useSelector(state =>
    getLastPlayed(state, feedUrl),
  );

  const { initialQueueLoaded, handleLoadMoreQueue } = useLoadQueue(
    feedUrl,
    data,
    shortcutId,
  );

  useLayoutAnimation([initialQueueLoaded]);

  // Map episode data to RNTP track model.
  const tracks = useMemo(
    () =>
      _.map(data, episode =>
        mapEpisodeToTrack(episode, feedUrl, defaultArtwork, downloadedEpisodes),
      ),
    [data, defaultArtwork, downloadedEpisodes, feedUrl],
  );

  const lastPlayedIndex = useMemo(
    () => _.findIndex(tracks, { id: lastPlayedEpisodeTrack?.id }),
    [lastPlayedEpisodeTrack, tracks],
  );

  const resolvedLastPlayedTrack = useMemo(
    () =>
      lastPlayedIndex < 0
        ? { ..._.head(tracks), queueIndex: 0 }
        : {
            ...tracks[lastPlayedIndex],
            queueIndex: lastPlayedIndex,
          },
    [lastPlayedIndex, tracks],
  );

  // Resolve playlist track objects, with given data.
  const playlist = useMemo(
    () => ({
      url: feedUrl,
      title,
      tracks,
      trackCount: meta.count,
      lastPlayed: resolvedLastPlayedTrack,
    }),
    [feedUrl, title, tracks, resolvedLastPlayedTrack, meta.count],
  );

  const { onPlaybackButtonPress } = usePodcastPlaylistPlayer({
    playlist: playlist ?? {},
    onLoadMoreQueue: handleLoadMoreQueue,
  });

  if (
    !playlist || // playlist object hasn't been created yet.
    activeSource?.url === feedUrl || // Hide button when this playlist (feed) is active in player.
    data?.length === 0 || // No episodes in feed.
    !initialQueueLoaded // Wait until last played episode has been loaded in collection.
  ) {
    return null;
  }

  return <PlayPodcastButton onPress={onPlaybackButtonPress} />;
};

PodcastPlaylistPlayer.propTypes = {
  data: PropTypes.array.isRequired,
  shortcutId: PropTypes.string.isRequired,
  meta: PropTypes.object,
  title: PropTypes.string,
};

PodcastPlaylistPlayer.defaultProps = {
  meta: {},
  title: 'Podcast RSS',
};

export default PodcastPlaylistPlayer;
