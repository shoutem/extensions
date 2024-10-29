import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getMeta } from '@shoutem/redux-io';
import { connectStyle } from '@shoutem/theme';
import { getShortcut } from 'shoutem.application';
import {
  getActiveSource,
  PlaybackControl,
  TrackPlayer,
  useTrackState,
} from 'shoutem.audio';
import { useLayoutAnimation } from 'shoutem.layouts';
import { PlayPodcastButton } from '../components';
import { ext } from '../const';
import { useLoadQueue, usePodcastPlaylistPlayer } from '../hooks';
import {
  getDownloadedEpisodes,
  getEpisodesFeed,
  getLastPlayed,
} from '../redux';
import { mapEpisodeToTrack } from '../services';

/**
 * Fragment rendering UI & managining playback of all episodes in the Podcast feed.
 * On mount, checks last played episode, loads all feed episodes before last played,
 * sets up audio queue and only then, shows UI allowing users to start Podcast feed playback.
 * Loading more episodes from anywhere will sync data in collection & audio player's queue.
 *
 * If resumePlaylistMode is true, playlist will start playing last played track, from last played position.
 * Otherwise, playlist will start and it will play track with given initialTrackId, from start.
 */
const PodcastPlaylistPlayer = ({
  shortcutId,
  initialTrackId,
  resumePlaylistMode = false,
  style,
}) => {
  const shortcut = useSelector(state => getShortcut(state, shortcutId));
  const { title = '' } = shortcut;
  const { feedUrl } = shortcut.settings;

  const episodesFeed = useSelector(state => getEpisodesFeed(state, feedUrl));
  const downloadedEpisodes = useSelector(getDownloadedEpisodes);
  const meta = getMeta(episodesFeed);
  const { imageUrl: defaultArtwork } = meta;

  const activeSource = useSelector(getActiveSource);
  const lastPlayedEpisodeTrack = useSelector(state =>
    getLastPlayed(state, feedUrl),
  );

  // Map episode data to RNTP track model.
  const tracks = useMemo(
    () =>
      _.map(episodesFeed, episode =>
        mapEpisodeToTrack(episode, feedUrl, defaultArtwork, downloadedEpisodes),
      ),
    [episodesFeed, defaultArtwork, downloadedEpisodes, feedUrl],
  );

  // If initialTrack is not found (user hasn't played any episodes yet), first episode in feed should be played as initial.
  const resolvedInitialTrack =
    _.find(tracks, track => track.id === initialTrackId) ?? tracks[0];

  const { initialQueueLoaded, handleLoadMoreQueue } = useLoadQueue({
    queueLoaded: !resumePlaylistMode, // Queue is loaded if user is starting play from details screen.
    shortcutId,
    feedUrl,
    data: episodesFeed,
    activeSource,
    initialTrackId: resolvedInitialTrack.id,
  });

  useLayoutAnimation([initialQueueLoaded]);

  const lastPlayedIndex = useMemo(
    () =>
      _.findIndex(tracks, {
        id: resolvedInitialTrack?.id ?? lastPlayedEpisodeTrack?.id,
      }),
    [resolvedInitialTrack, lastPlayedEpisodeTrack, tracks],
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

  const { isActiveAndPlaying, isLoadingOrBuffering, isActive } = useTrackState({
    track: resolvedInitialTrack,
  });

  // Hide button when:
  if (
    // playlist object hasn't been created yet
    !playlist ||
    // Playlist was resumed from list screen & that feed is active playlist
    (resumePlaylistMode && activeSource?.url === feedUrl) ||
    // There are no episodes in feed
    episodesFeed?.length === 0 ||
    // Queue is being set up
    !initialQueueLoaded
  ) {
    return null;
  }

  if (resumePlaylistMode) {
    return <PlayPodcastButton onPress={onPlaybackButtonPress} />;
  }

  const resolvedIconName = isActiveAndPlaying ? 'pause' : 'play';

  const handleEpisodePlaybackButtonPress = async () => {
    // If it is not currently active source, start the playlist, play given initialTrack.
    if (activeSource?.url !== feedUrl) {
      onPlaybackButtonPress();
      return;
    }

    // If playlist is active, we have to handle "communication" between playback buttons in details screen and
    // resume playlist button in list screen.
    if (!isActive) {
      await TrackPlayer.skip(playlist.lastPlayed.queueIndex);
      await TrackPlayer.play();
      return;
    }

    if (isActiveAndPlaying) {
      await TrackPlayer.pause();
      return;
    }

    await TrackPlayer.play();
  };

  return (
    <PlaybackControl
      onPress={handleEpisodePlaybackButtonPress}
      isLoadingOrBuffering={isLoadingOrBuffering}
      iconName={resolvedIconName}
      style={style.playbackControl}
    />
  );
};

PodcastPlaylistPlayer.propTypes = {
  shortcutId: PropTypes.string.isRequired,
  initialTrackId: PropTypes.string,
  resumePlaylistMode: PropTypes.bool,
  style: PropTypes.object,
};

PodcastPlaylistPlayer.defaultProps = {
  initialTrackId: undefined,
  resumePlaylistMode: true,
  style: {},
};

export default connectStyle(ext('PodcastPlaylistPlayer'))(
  PodcastPlaylistPlayer,
);
