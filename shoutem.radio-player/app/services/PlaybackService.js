import { Platform } from 'react-native';
import { Event, TrackPlayer } from 'shoutem.audio';
import { RADIO_TRACK_IDENTIFIER } from '../const';
import { resolveMetadata } from './metadata';

const shouldHandleEvent = activeTrack => {
  if (!activeTrack || !activeTrack.id.startsWith(RADIO_TRACK_IDENTIFIER)) {
    return false;
  }

  return true;
};

export const PlaybackService = async () => {
  TrackPlayer.addEventListener(Event.MetadataTimedReceived, async event => {
    const activeTrack = await TrackPlayer.getActiveTrack();

    if (!shouldHandleEvent(activeTrack)) {
      return;
    }

    const songInformation = event.metadata[0]?.title;

    const { artist, title, artwork } = await resolveMetadata(
      activeTrack.url,
      songInformation,
    );

    await TrackPlayer.updateNowPlayingMetadata({
      artist,
      title,
      artwork,
    });
  });

  // On certain Android devices, the Pause remote control is displayed regardless of the specified remote capabilities.
  // It's crucial to avoid pausing the stream, as resuming playback might result in a delay. Our goal is to stop the current stream,
  // buffer it anew, and then resume playback to ensure real-time streaming.
  TrackPlayer.addEventListener(Event.RemotePlay, async () => {
    const activeTrack = await TrackPlayer.getActiveTrack();

    if (!shouldHandleEvent(activeTrack) || Platform.OS !== 'android') {
      return;
    }

    await TrackPlayer.stop();
    await TrackPlayer.play();
  });
};
