import { Platform } from 'react-native';
import {
  useActiveTrack,
  useNowPlayingMetadata,
} from 'react-native-track-player';

/**
 * Resolve metadata for active track or stream.
 */
export const useActiveMetadata = () => {
  const activeTrack = useActiveTrack();
  const nowPlayingMetadata = useNowPlayingMetadata();

  // We're note manually updating track metdata on Android, because lock screen artwork gets
  // messed up.
  // So, we're using metadata info from active track instead.
  // Everything works as expected on iOS and for live streams.
  const activeMetadata =
    Platform.OS === 'android' && !activeTrack?.isLiveStream
      ? activeTrack
      : nowPlayingMetadata;

  return { activeTrack, activeMetadata };
};
