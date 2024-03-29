import { useCallback, useEffect } from 'react';
import { Platform } from 'react-native';
import TrackPlayer, { State, useActiveTrack } from 'react-native-track-player';
import _ from 'lodash';
import { useAudioPlayerBanner } from './useAudioPlayerBanner';
import { useTrackState } from './useTrackState';

export const usePlaybackBehavior = ({
  track,
  onBeforePlay,
  onPlay,
  onStop,
  onPause,
  onError,
  onFirstPlay,
} = {}) => {
  const activeTrack = useActiveTrack();
  const { isShown: isBannerShown, show: showBanner } = useAudioPlayerBanner();
  const {
    playback: { state, error },
    isActive,
    playing,
  } = useTrackState({ track });

  const showAudioBanner = useCallback(async () => {
    if (!isBannerShown) {
      showBanner();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isBannerShown]);

  const handleStop = useCallback(async () => {
    // Before fetching metadata for the source that will be played, we need to ensure that any existing metadata from
    // another source is cleared. This is crucial because the metadata is "patched", if update object has any key defined.
    // If the new source's metadata lacks  any essential information such as artwork, artist, or title, the metadata
    // will retain these missing details from the previous source.

    // Android throws Unhandled Promise Rejection when trying to reset or clear metadata, when
    // there's no active track, while iOS needs to clear metadata regardless of active track.
    if (Platform.OS === 'ios' || activeTrack) {
      await TrackPlayer.updateNowPlayingMetadata({});
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (error && isActive && _.isFunction(onError)) {
      onError();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, isActive]);

  useEffect(() => {
    if (playing) {
      if (_.isFunction(onPlay)) {
        onPlay();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing]);

  useEffect(() => {
    if (state === State.Stopped) {
      if (_.isFunction(onStop)) {
        onStop();
      } else {
        handleStop();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  useEffect(() => {
    if (state === State.Paused) {
      if (_.isFunction(onPause)) {
        onPause();
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state]);

  const onPlaybackButtonPress = async () => {
    showAudioBanner();

    if (track && !isActive) {
      try {
        await TrackPlayer.reset();
        await TrackPlayer.updateNowPlayingMetadata({});
      } catch (e) {
        if (e.code === 'no_current_item') {
          // Android throws Unhandled Promise Rejection when trying to reset or clear metadata, when
          // there's no active track, iOS doesn't. We can ignore error, because if there is no active track,
          // everything is set as expected.
        }
      }

      if (_.isFunction(onFirstPlay)) {
        await onFirstPlay();
      }

      await TrackPlayer.setQueue([track]);

      if (_.isFunction(onBeforePlay)) {
        await onBeforePlay();
      }

      await TrackPlayer.play();
      return;
    }

    if (playing) {
      if (track?.isLiveStream) {
        await TrackPlayer.stop();
      } else {
        await TrackPlayer.pause();
      }

      return;
    }

    if (_.isFunction(onBeforePlay)) {
      await onBeforePlay();
    }

    await TrackPlayer.play();
  };

  // To enchance user experience, start playing automatically after seek is done.
  const onSeekComplete = async newPosition => {
    await TrackPlayer.seekTo(newPosition);
    await TrackPlayer.play();
  };

  return { onPlaybackButtonPress, onSeekComplete };
};
