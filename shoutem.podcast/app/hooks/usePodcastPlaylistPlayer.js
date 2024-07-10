import { useCallback, useMemo } from 'react';
import { Platform } from 'react-native';
import { useDispatch } from 'react-redux';
import {
  Capability,
  TrackPlayer,
  updateActiveSource,
  usePlaylistPlayer,
  useProgressTracking,
  useSetupPlayerAndOptions,
  useTrackState,
} from 'shoutem.audio';
import { AUDIO_SOURCE_TYPE } from 'shoutem.audio/const';

const IOS_CAPABILITIES = [Capability.SkipToNext, Capability.SkipToPrevious];
// Jump controls will be shown on Android only, when playing Podcast playlist.
// iOS supports either, jump or skip controls, not both at same time and we will be showing skip controls.
const ANDROID_CAPABILITIES = [
  Capability.JumpForward,
  Capability.JumpBackward,
  Capability.SkipToNext,
  Capability.SkipToPrevious,
];

const PLAYER_OPTIONS = {
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    Capability.SeekTo,
    ...(Platform.OS === 'ios' ? IOS_CAPABILITIES : ANDROID_CAPABILITIES),
  ],
  compactCapabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.SeekTo,
    Capability.SkipToNext,
    Capability.SkipToPrevious,
    ...(Platform.OS === 'ios' ? IOS_CAPABILITIES : ANDROID_CAPABILITIES),
  ],
  backwardJumpInterval: 10,
  forwardJumpInterval: 30,
};

/**
 * Given playlist information & tracks, sets up audio player queue and checks for last played episode.
 * If there's last played episode, it'll seek to time user last left of and start playing from there.
 * Automatically switches to next episode when prev is done, updates last played episode and updates
 * progress of each active episode in intervals.
 * @returns lastPlayed track, on press playback callback & active playlist status
 */
export const usePodcastPlaylistPlayer = ({ playlist, onLoadMoreQueue }) => {
  const dispatch = useDispatch();

  // Because setQueue set first track in queue as active track, we're failing to resolve
  // expected track for resolving initial position - it resolves initial position for queue[0] track.
  // To conform this issue, we use lastPlayed as definite source of truth - it resolves expected
  // track. First track to play is lastPlayed and each time new track becomes active, we update lastPlayed,
  // so our playlist.lastPlayed is updated as expected, too.

  const {
    progressUpdateEventInterval,
    seekToInitialPosition,
  } = useProgressTracking({
    track: playlist.lastPlayed,
  });

  const onFirstPlay = useCallback(async () => {
    await TrackPlayer.setQueue(playlist.tracks);

    await dispatch(
      updateActiveSource({
        type: AUDIO_SOURCE_TYPE.PLAYLIST,
        url: playlist.url,
        title: playlist.title,
        trackCount: playlist.trackCount,
        onLoadMoreQueue,
      }),
    );

    if (playlist.lastPlayed) {
      await TrackPlayer.skip(playlist.lastPlayed.queueIndex);
    }

    await seekToInitialPosition();
  }, [dispatch, onLoadMoreQueue, playlist, seekToInitialPosition]);

  const updateOptions = useMemo(
    () => ({ ...PLAYER_OPTIONS, progressUpdateEventInterval }),
    [progressUpdateEventInterval],
  );

  useSetupPlayerAndOptions({
    track: playlist.lastPlayed,
    updateOptions,
  });

  const { isActive, isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track: playlist.lastPlayed,
  });

  const { onPlaybackButtonPress } = usePlaylistPlayer({
    playlist,
    onFirstPlay,
  });

  return {
    // lastPlayed is always active track if Podcast playlist player is active. The advantage of using lastPlayed
    // is because it's never undefined if Podcast playlist player is active, unlike active track.
    track: playlist.lastPlayed,
    isActive,
    isActiveAndPlaying,
    isLoadingOrBuffering,
    onPlaybackButtonPress,
  };
};
