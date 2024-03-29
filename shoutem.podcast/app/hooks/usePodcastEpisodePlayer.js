import { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import {
  Capability,
  setActivePlaylistOrStream,
  usePlaybackBehavior,
  useProgressTracking,
  useSetupPlayerAndOptions,
  useTrackState,
} from 'shoutem.audio';
import { updateLastPlayed } from '../redux';

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

export const usePodcastEpisodePlayer = ({ track, playlist }) => {
  const dispatch = useDispatch();

  const onFirstPlay = useCallback(() => {
    dispatch(setActivePlaylistOrStream(playlist));
    dispatch(updateLastPlayed(playlist.id, track));
  }, [dispatch, playlist, track]);

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

  const { onPlaybackButtonPress } = usePlaybackBehavior({
    track,
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
