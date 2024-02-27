import { useEffect, useState } from 'react';
import TrackPlayer, {
  State,
  usePlaybackState,
  usePlayWhenReady,
  useProgress,
} from 'react-native-track-player';
import _ from 'lodash';
import { Toast } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext, STOP_PLAYBACK_TYPE } from '../const';
import { SetupService } from '../services';

/**
 * Hook for managing playback, progress, and playback state events.
 * @param {object} options - Configuration options for the player.
 * @param {Array} options.tracks - Array of tracks to be played by the player. See https://rntp.dev/docs/api/objects/track
 * @param {object} options.updateOptions - Options for configuring the player. See https://rntp.dev/docs/api/objects/update-options
 * @param {string} options.stopPlaybackType - Type of stopping playback, either 'pause' or 'stop'.
 * ---
 * @returns {object} An object containing playback information and control functions.
 * @property {object} playback - Current playback state and error message if in error state.
 * @property {boolean} isActivePlayer - Indicates if this instance of a player is currently active.
 * @property {number} buffered - Percentage of buffered content.
 * @property {number} position - Current playback position in seconds.
 * @property {number} duration - Total duration of the track in seconds.
 * @property {function} onPlaybackButtonPress - Function to handle playback button press, depending on current playback state.
 * @property {function} onSeekComplete - Function to handle seek completion. Track is automatically played after seek is completed.
 * @property {function} onQueueChange - Function to execute after queeu has been updated after playback button is pressed.
 */
export const usePlayer = ({
  tracks,
  updateOptions,
  stopPlaybackType = STOP_PLAYBACK_TYPE.PAUSE,
  onQueueChange,
}) => {
  useEffect(() => {
    SetupService.register();
  }, []);

  // NOTE: A one-time warning occurs due to late player setup, indicating the player may not be set up
  // in time to fetch player data (e.g. from hooks). This is intentional to ensure a safe player setup.
  // For details, see SetupService.register annotation.
  const playing = usePlayWhenReady();
  const playback = usePlaybackState();
  const { buffered, duration, position } = useProgress(100);

  // Indicator if given tracks are match to current player's queue state.
  // This is used to determine which player instances/hooks should be updated accordingly.
  // E.g., if multiple radio shortcuts, multiple usePlayer hooks are mounted, we have
  // to determine which shortcut should display spinner for loading state.
  const [isActivePlayer, setActivePlayer] = useState(false);

  useEffect(() => {
    TrackPlayer.getQueue().then(queue => {
      if (_.isEmpty(queue)) {
        return;
      }

      const queueIds = _.map(queue, 'id');
      const tracksIds = _.map(tracks, 'id');

      if (_.isEqual(queueIds, tracksIds)) {
        setActivePlayer(true);
      } else {
        setActivePlayer(false);
      }
    });
  }, [tracks, playing]);

  // Options are set after play is initiated and player is ready to accommodate multiple sources (radio, podcast).
  // Pressing play serves as the definitive trigger to update the active player, along with its options and capabilities.
  // Executing this process earlier could lead to a scenario where radio is playing, yet Podcast remote controls are shown,
  // that radio can't utilize (e.g., jump forward/back). This occurs simply because the Podcast screen was opened but
  // play wasn't initiated.
  useEffect(() => {
    if (playback.state === State.Ready && isActivePlayer) {
      SetupService.updateOptions(updateOptions);
    }
  }, [playback.state, isActivePlayer, updateOptions]);

  // Sometimes, we want to update options after all track data is resolved - after play.
  // Currently, we're calculating progress update event interval based on track duration, which
  // is impossible before track is loaded and duration is fetched.
  useEffect(() => {
    if (playback.state === State.Playing && isActivePlayer) {
      SetupService.updateOptions(updateOptions);
    }
  }, [playback.state, isActivePlayer, updateOptions]);

  useEffect(() => {
    if (playback?.error && isActivePlayer) {
      Toast.showInfo({
        title: I18n.t(ext('playbackErrorTitle')),
        message: I18n.t(ext('playbackErrorMessage')),
      });
    }
  }, [playback?.error, isActivePlayer]);

  const onPlaybackButtonPress = async () => {
    if (!isActivePlayer) {
      await TrackPlayer.stop();
      await TrackPlayer.setQueue(tracks);

      if (_.isFunction(onQueueChange)) {
        await onQueueChange();
      }

      await TrackPlayer.play();
      return;
    }

    if (playback.state === State.Playing) {
      stopPlaybackType === STOP_PLAYBACK_TYPE.PAUSE
        ? await TrackPlayer.pause()
        : await TrackPlayer.stop();

      return;
    }

    // Not using State.Ended here because it does not enter Ended state always - progress and duration
    // have high amount of decimals and progress doesn't always reach duration's value.
    // Instead, if progress is less than 1 second away from duration, consider this track has ended and play
    // the track from the beggining.
    if (duration - position < 1 && isActivePlayer) {
      await TrackPlayer.seekTo(0);
    }

    await TrackPlayer.play();
  };

  // To enchance user experience, start playing automatically after seek is done.
  const onSeekComplete = async newPosition => {
    await TrackPlayer.seekTo(newPosition);
    await TrackPlayer.play();
  };

  return {
    playback,
    isActivePlayer,
    buffered,
    position,
    duration,
    onPlaybackButtonPress,
    onSeekComplete,
  };
};
