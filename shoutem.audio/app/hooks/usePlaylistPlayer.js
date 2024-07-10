import { useActiveTrack } from 'react-native-track-player';
import { useSelector } from 'react-redux';
import { getActiveSource } from '../redux';
import { useTrackPlayer } from './useTrackPlayer';

/**
 * Manages playlist playback.
 * Resets current player state, sets queue and integrates with useTrackPlayer which provides
 * playback behavior and callback definitions on each track change.
 */
export const usePlaylistPlayer = ({
  playlist,
  onBeforePlay,
  onPlay,
  onStop,
  onPause,
  onError,
  onFirstPlay,
} = {}) => {
  const activeTrack = useActiveTrack();
  const activeSource = useSelector(getActiveSource);
  const isFirstPlay = activeSource?.url !== playlist.url;

  const { onSeekComplete, onPlaybackButtonPress } = useTrackPlayer({
    track: activeTrack,
    isFirstPlay,
    onFirstPlay,
    onBeforePlay,
    onPlay,
    onStop,
    onPause,
    onError,
  });

  return { onPlaybackButtonPress, onSeekComplete };
};
