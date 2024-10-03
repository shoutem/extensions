import _ from 'lodash';
import {
  Event,
  getActiveSource,
  TrackPlayer,
  updateAudioTrackProgress,
} from 'shoutem.audio';
import { isIos } from 'shoutem-core';
import { ext, PODCAST_TRACK_IDENTIFIER } from '../const';
import { updateLastPlayed } from '../redux';

const shouldHandleEvent = activeTrack => {
  if (!activeTrack || !activeTrack.id.startsWith(PODCAST_TRACK_IDENTIFIER)) {
    return false;
  }

  return true;
};

export const PlaybackService = async (dispatch, getState) => {
  /**
   * When active track changes & if it is Podcast episode, this handler will update last played episode
   * in Redux state, update now playing metadata & load more episodes if active track is last or second
   * to last in current queue.
   */
  TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    async event => {
      const newActiveTrack = event.track;

      if (!shouldHandleEvent(newActiveTrack)) {
        return;
      }

      await dispatch(
        updateLastPlayed(newActiveTrack.playlistOrStreamUrl, newActiveTrack),
      );

      // Metadata automatically resolves on Android. If this is called on Android, artwork is missing in lock screen.
      if (isIos) {
        await TrackPlayer.updateNowPlayingMetadata({
          artist: newActiveTrack.artist,
          title: newActiveTrack.title,
          artwork: newActiveTrack.artwork,
        });
      }

      // If new active track is last or second to last in queue and more tracks can be loaded,
      // preload more tracks into queue for better UX. By preloading this when second to last track
      // starts, skip to next button in audio modal will be enabled as soon as last track starts playing.
      const queue = await TrackPlayer.getQueue();
      const positionInQueue = _.findIndex(queue, { id: newActiveTrack.id }) + 1;

      // If new active track is last or second to last in queue
      if (
        positionInQueue === queue.length ||
        positionInQueue === queue.length - 1
      ) {
        const state = getState();
        const activeSource = getActiveSource(state);

        // If there are more tracks to be loaded into queue
        if (
          activeSource.trackCount > queue.length &&
          _.isFunction(activeSource.onLoadMoreQueue)
        ) {
          activeSource.onLoadMoreQueue();
        }
      }
    },
  );

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
