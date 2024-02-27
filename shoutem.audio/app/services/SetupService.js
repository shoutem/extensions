import TrackPlayer, {
  AppKilledPlaybackBehavior,
} from 'react-native-track-player';

/**
 *  To ensure proper setup on Android devices, setupPlayer must complete while the app is in the foreground.
    Setup failure could theoretically occur if the user backgrounds the app precisely when the audio player screen mounts,
    only during the first mount of any of audio player screens.
    Despite this rare scenario, we call setupPlayer on each mount to guarantee proper player setup.
    If it was already set up, any subsequent calls will gracefully handle errors and can be safely ignored.
 */
const register = async () => {
  TrackPlayer.setupPlayer({
    autoHandleInterruptions: true,
  }).catch(e => {
    if (e.code === 'android_cannot_setup_player_in_background') {
      TrackPlayer.setupPlayer({
        autoHandleInterruptions: true,
      });
    } else {
      // Do nothing, player was set up already.
    }
  });
};

export const updateOptions = async options =>
  TrackPlayer.updateOptions({
    android: {
      appKilledPlaybackBehavior:
        AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification,
    },
    ...options,
  });

export const SetupService = { register, updateOptions };
