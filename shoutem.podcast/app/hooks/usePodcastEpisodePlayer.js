import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Capability,
  getActiveSource,
  TrackPlayer,
  updateActiveSource,
  useProgressTracking,
  useSetupPlayerAndOptions,
  useTrackPlayer,
  useTrackState,
} from 'shoutem.audio';
import { AUDIO_SOURCE_TYPE } from 'shoutem.audio/const';

const PLAYER_OPTIONS = {
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpForward,
    Capability.JumpBackward,
    Capability.SeekTo,
  ],
  compactCapabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpForward,
    Capability.JumpBackward,
    Capability.SeekTo,
  ],
  backwardJumpInterval: 10,
  forwardJumpInterval: 30,
};

/**
 * Mathches given track against active track, provides playback status and playback callback definitions
 * for given track.
 */
export const usePodcastEpisodePlayer = ({ track, title }) => {
  const dispatch = useDispatch();

  const activeSource = useSelector(getActiveSource);

  const onFirstPlay = useCallback(async () => {
    dispatch(
      updateActiveSource({
        type: AUDIO_SOURCE_TYPE.TRACK,
        url: track.url,
        title,
      }),
    );

    await TrackPlayer.setQueue([track]);
  }, [track, dispatch, title]);

  const {
    progressUpdateEventInterval,
    seekToInitialPosition,
  } = useProgressTracking({ track });

  const updateOptions = useMemo(
    () => ({ ...PLAYER_OPTIONS, progressUpdateEventInterval }),
    [progressUpdateEventInterval],
  );

  useSetupPlayerAndOptions({
    track,
    updateOptions,
  });

  const { isActive, isActiveAndPlaying, isLoadingOrBuffering } = useTrackState({
    track,
  });

  const { onPlaybackButtonPress } = useTrackPlayer({
    track,
    isFirstPlay: activeSource?.url !== track?.url,
    onFirstPlay,
    onBeforePlay: seekToInitialPosition,
  });

  return {
    track,
    isActive,
    isActiveAndPlaying,
    isLoadingOrBuffering,
    onPlaybackButtonPress,
  };
};
