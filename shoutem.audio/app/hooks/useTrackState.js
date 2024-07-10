import { useMemo } from 'react';
import {
  State,
  useActiveTrack,
  useIsPlaying,
  usePlaybackState,
} from 'react-native-track-player';

/**
 * Matches given track against active track and returns general and computed playback state variables.
 */
export const useTrackState = ({ track } = {}) => {
  const playback = usePlaybackState();
  const activeTrack = useActiveTrack();
  const { bufferingDuringPlay, playing } = useIsPlaying();

  const isActive = useMemo(() => activeTrack?.id === track?.id, [
    activeTrack,
    track,
  ]);

  const isActiveAndPlaying = useMemo(() => isActive && playing, [
    isActive,
    playing,
  ]);

  const isLoadingOrBuffering = useMemo(
    () =>
      isActive &&
      (playback.state === State.Loading ||
        (playback.state === State.Buffering && !bufferingDuringPlay)),
    [bufferingDuringPlay, isActive, playback.state],
  );

  return {
    playback,
    playing,
    isActive,
    isActiveAndPlaying,
    isLoadingOrBuffering,
  };
};
