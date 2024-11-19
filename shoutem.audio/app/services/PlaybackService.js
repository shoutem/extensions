import TrackPlayer, { Event, State } from 'react-native-track-player';
import { Toast } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { isWeb } from 'shoutem-core';
import { AUDIO_SOURCE_TYPE, ext } from '../const';
import { getActiveSource } from '../redux';

// Common event handlers that are applied universally to all track player implementations. If you wish to
// extend this behavior with module specific logic, create PlaybackService inside appropriate module and register it
// inside appDidMount.
// If you wish to subscribe to desired events and manage them according to requirements only while component is mounted,
// utilize the useTrackPlayerEvents hook.
export const PlaybackService = async (_dispatch, getState) => {
  TrackPlayer.addEventListener(Event.RemotePause, TrackPlayer.pause);

  TrackPlayer.addEventListener(Event.RemoteStop, TrackPlayer.stop);

  TrackPlayer.addEventListener(Event.RemotePlay, TrackPlayer.play);

  TrackPlayer.addEventListener(Event.RemoteNext, async () => {
    await TrackPlayer.skipToNext();
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemotePrevious, async () => {
    await TrackPlayer.skipToPrevious();
    await TrackPlayer.play();
  });

  // To enchance user experience, automatically play the track after user has seeked or jumped.
  TrackPlayer.addEventListener(Event.RemoteJumpForward, async event => {
    await TrackPlayer.seekBy(event.interval);
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteJumpBackward, async event => {
    await TrackPlayer.seekBy(-event.interval);
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.RemoteSeek, async event => {
    await TrackPlayer.seekTo(event.position);
    await TrackPlayer.play();
  });

  TrackPlayer.addEventListener(Event.PlaybackError, async () => {
    Toast.showInfo({
      title: I18n.t(ext('playbackErrorTitle')),
      message: I18n.t(ext('playbackErrorMessage')),
    });
  });

  TrackPlayer.addEventListener(Event.PlaybackState, async event => {
    if (event.state !== State.Ended) {
      return;
    }

    // Ended event will fire only if queue has reached end AND if repeat mode
    // is off.

    // Web automatically plays after skip is done & pause fails for unknown reason.
    // Adding condition until we have the time to patch web code.
    // Right now, web will stop after finishing queue, but will have last track as active
    // and it's progress will be 100%.
    // In web, currently, it is impossible to start playing from start when it's complete, unless
    // user sets repeat-playlist, which will start playlist all over again.
    if (!isWeb) {
      await TrackPlayer.skip(0);
      await TrackPlayer.pause(); // Android starts playing automatically after skipping track.
    }

    const state = getState();
    const activeSource = getActiveSource(state);

    if (activeSource.type === AUDIO_SOURCE_TYPE.PLAYLIST) {
      Toast.showInfo({
        title: I18n.t(ext('queueFinishedToastTitle')),
        message: I18n.t(ext('queueFinishedToastMessage')),
      });
    }
  });
};
