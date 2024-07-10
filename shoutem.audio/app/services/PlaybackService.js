import TrackPlayer, { Event } from 'react-native-track-player';
import { Toast } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { ext } from '../const';

// Common event handlers that are applied universally to all track player implementations. If you wish to
// extend this behavior with module specific logic, create PlaybackService inside appropriate module and register it
// inside appDidMount.
// If you wish to subscribe to desired events and manage them according to requirements only while component is mounted,
// utilize the useTrackPlayerEvents hook.
export const PlaybackService = async () => {
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
};
