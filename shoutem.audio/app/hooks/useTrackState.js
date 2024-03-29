import { useMemo } from 'react';
import {
  State,
  useActiveTrack,
  useIsPlaying,
  usePlaybackState,
} from 'react-native-track-player';

export const useTrackState = ({ track } = {}) => {
  const playback = usePlaybackState();
  const { playing = false, bufferingDuringPlay } = useIsPlaying();
  const activeTrack = useActiveTrack();

  // We can pass track as undefined in scenarios where we want to get state of currently active track.
  const isActive = useMemo(
    () => (!track ? !!activeTrack : activeTrack?.id === track?.id),
    [activeTrack, track],
  );

  const isActiveAndPlaying = useMemo(() => isActive && playing, [
    isActive,
    playing,
  ]);
  const isLoadingOrBuffering = useMemo(
    () =>
      isActive &&
      (bufferingDuringPlay ||
        playback.state === State.Loading ||
        playback.state === State.Buffering),
    [isActive, bufferingDuringPlay, playback.state],
  );

  return {
    playback,
    playing,
    isActive,
    isActiveAndPlaying,
    isLoadingOrBuffering,
  };
};
