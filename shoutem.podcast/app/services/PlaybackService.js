import {
  Event,
  State,
  TrackPlayer,
  updateAudioTrackProgress,
} from 'shoutem.audio';
import { ext, PODCAST_TRACK_IDENTIFIER } from '../const';
import { clearLastPlayed } from '../redux';

const shouldHandleEvent = activeTrack => {
  if (!activeTrack || !activeTrack.id.startsWith(PODCAST_TRACK_IDENTIFIER)) {
    return false;
  }

  return true;
};

export const PlaybackService = async dispatch => {
  TrackPlayer.addEventListener(
    Event.PlaybackPlayWhenReadyChanged,
    async event => {
      if (!event.playWhenReady) {
        return;
      }

      const activeTrack = await TrackPlayer.getActiveTrack();

      if (!shouldHandleEvent(activeTrack)) {
        return;
      }

      await TrackPlayer.updateNowPlayingMetadata({
        artist: activeTrack.artist,
        title: activeTrack.title,
        artwork: activeTrack.artwork,
      });
    },
  );

  TrackPlayer.addEventListener(Event.PlaybackState, async event => {
    if (event.state !== State.Ended) {
      return;
    }

    dispatch(clearLastPlayed());
  });

  TrackPlayer.addEventListener(Event.PlaybackProgressUpdated, async event => {
    const activeTrack = await TrackPlayer.getActiveTrack();

    if (!shouldHandleEvent(activeTrack)) {
      return;
    }

    // When transitioning between tracks, there is a brief timespan of approximately 1 second before the track player sets up the new track.
    // During this time, we continue to receive progress updates from the last active track, with its progress set to 0.
    // To maintain accuracy, we refrain from updating our stored progress during this brief interval, which lasts for the first 2 seconds.
    // Additionally, 2 seconds is the minimum allowed interval for receiving progress update events.
    if (event.position > 2) {
      dispatch(
        updateAudioTrackProgress(
          ext(),
          activeTrack.id,
          event.position,
          event.duration,
        ),
      );
    }
  });
};
