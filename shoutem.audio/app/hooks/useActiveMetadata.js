import {
  useActiveTrack,
  useNowPlayingMetadata,
} from 'react-native-track-player';
import { isIos } from 'shoutem-core';

/**
 * Resolve metadata for active track or stream.
 */
export const useActiveMetadata = () => {
  const activeTrack = useActiveTrack();
  const nowPlayingMetadata = useNowPlayingMetadata();

  // We're note manually updating track metdata on Android, because lock screen artwork gets
  // messed up.
  // Also, web uses active track instead of now playing metadata, because it doesn't
  // So, we're using metadata info from active track instead.
  // Everything works as expected on iOS and for live streams.
  const activeMetadata =
    isIos || activeTrack?.isLiveStream ? nowPlayingMetadata : activeTrack;

  return { activeTrack, activeMetadata };
};
