import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import {
  getActiveSource,
  PlaybackControl,
  TrackPlayer,
  useTrackState,
} from 'shoutem.audio';
import { useLayoutAnimation } from 'shoutem.layouts';
import { PlayPodcastButton } from '../components';
import { ext, PODCAST_FAVORITES_PLAYLIST_IDENTIFIER } from '../const';
import { usePodcastPlaylistPlayer } from '../hooks';
import { getDownloadedEpisodes } from '../redux';
import { mapEpisodeToTrack } from '../services';

/**
 * Fragment rendering playback button & managining playlist playback of all favorite episodes.
 */
const FavoritePodcastPlaylistPlayer = ({
  favorites,
  initialTrackId,
  resumePlaylistMode,
  queueLoading,
  playlistTitle,
  style,
}) => {
  useLayoutAnimation([queueLoading]);

  const downloadedEpisodes = useSelector(getDownloadedEpisodes);
  const activeSource = useSelector(getActiveSource);

  // Map favorite episodes data to RNTP track model.
  const tracks = useMemo(() => {
    return _.reduce(
      favorites,
      (result, shortcutFavorites) => {
        const shortcutFavoriteTracks = _.map(
          shortcutFavorites.favorites,
          favoriteEpisode =>
            mapEpisodeToTrack(
              favoriteEpisode,
              // Usually feed URL, but here we're using it as ID for saving last played episode in favorites playlist.
              // Episode saved as last played will be used as initial track when playing playlist from favorites list screen.
              PODCAST_FAVORITES_PLAYLIST_IDENTIFIER,
              shortcutFavorites.meta.imageUrl,
              downloadedEpisodes,
            ),
        );

        return [...result, ...shortcutFavoriteTracks];
      },
      [],
    );
  }, [downloadedEpisodes, favorites]);

  // Initial track will be last played episode if playlist is starting from favorites list screen,
  // or exact episode if starting from episode details screen.
  // If there is no last played episode, first episode in playlist will be played.
  const initialTrack = _.find(tracks, { id: initialTrackId }) ?? _.head(tracks);

  const initialTrackIndex = useMemo(() => {
    const initialTrackIndex = _.findIndex(tracks, {
      id: initialTrack?.id,
    });

    return initialTrackIndex < 0 ? 0 : initialTrackIndex;
  }, [initialTrack, tracks]);

  const resolvedLastPlayedTrack = useMemo(
    () => ({
      ...tracks[initialTrackIndex],
      queueIndex: initialTrackIndex,
    }),
    [initialTrackIndex, tracks],
  );

  // Resolve playlist track objects, with given data.
  const playlist = useMemo(
    () => ({
      url: PODCAST_FAVORITES_PLAYLIST_IDENTIFIER,
      title: playlistTitle,
      tracks,
      trackCount: tracks?.length,
      lastPlayed: resolvedLastPlayedTrack,
    }),
    [playlistTitle, resolvedLastPlayedTrack, tracks],
  );

  const { onPlaybackButtonPress } = usePodcastPlaylistPlayer({
    playlist: playlist ?? {},
  });

  const { isActive, isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track: initialTrack,
  });

  // Hide button when:
  if (
    // Playlist object hasn't been created yet
    !playlist ||
    // There are no favorite episodes
    playlist.trackCount === 0 ||
    // Favorites playlist is active
    (resumePlaylistMode &&
      activeSource?.url === PODCAST_FAVORITES_PLAYLIST_IDENTIFIER) ||
    // Favorite episodes are loading
    queueLoading
  ) {
    return null;
  }

  if (resumePlaylistMode) {
    return <PlayPodcastButton onPress={onPlaybackButtonPress} />;
  }

  const handleEpisodePlaybackButtonPress = async () => {
    // If it is not currently active source, start the playlist, play given initialTrack.
    if (activeSource?.url !== PODCAST_FAVORITES_PLAYLIST_IDENTIFIER) {
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

  const resolvedIconName = isActiveAndPlaying ? 'pause' : 'play';

  return (
    <PlaybackControl
      onPress={handleEpisodePlaybackButtonPress}
      isLoadingOrBuffering={isLoadingOrBuffering}
      iconName={resolvedIconName}
      style={style.playbackControl}
    />
  );
};

FavoritePodcastPlaylistPlayer.propTypes = {
  favorites: PropTypes.array.isRequired,
  style: PropTypes.object.isRequired,
  initialTrackId: PropTypes.string,
  playlistTitle: PropTypes.string,
  queueLoading: PropTypes.bool,
  resumePlaylistMode: PropTypes.bool,
};

FavoritePodcastPlaylistPlayer.defaultProps = {
  initialTrackId: undefined,
  playlistTitle: '',
  queueLoading: true,
  resumePlaylistMode: false,
};

// Connected to PodcastPlaylistPlayer intentionally, to have a single style for both players.
export default connectStyle(ext('PodcastPlaylistPlayer'))(
  FavoritePodcastPlaylistPlayer,
);
