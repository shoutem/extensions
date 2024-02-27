import { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  Capability,
  convertSecondsToTimeDisplay,
  getAudioTrackProgress,
  State,
  TrackPlayer,
  updateAudioTrackProgress,
  usePlayer,
} from 'shoutem.audio';
import { ext } from '../const';
import { calculateProgressInterval } from '../services';

export const SKIP_BACK_TIME = 10;
export const SKIP_FORWARD_TIME = 30;

const PLAYER_OPTIONS = {
  capabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpForward,
    Capability.JumpBackward,
    Capability.SeekTo,
  ],
  compactCapabilities: [
    Capability.Play,
    Capability.Pause,
    Capability.JumpForward,
    Capability.JumpBackward,
    Capability.SeekTo,
  ],
  backwardJumpInterval: SKIP_BACK_TIME,
  forwardJumpInterval: SKIP_FORWARD_TIME,
};

export const usePodcastPlayerFeatures = ({ track }) => {
  const dispatch = useDispatch();

  const savedProgress = useSelector(state =>
    getAudioTrackProgress(state, ext(), track.id),
  );

  const handleSeekBeforePlaying = async () => {
    // Not using State.Ended here because it does not enter Ended state always - progress and duration
    // have high amount of decimals and progress doesn't always reach duration's value.
    // Instead, if progress is less than 1 second away from duration, consider this track has ended and play
    // the track from the beggining.
    const resolvedSeekPosition =
      savedProgress.duration - savedProgress.position < 1 ||
      !savedProgress.position
        ? 0
        : savedProgress.position;

    await TrackPlayer.seekTo(resolvedSeekPosition);
  };

  // Set 2 seconds interval as base. Once track's duration is fetched, it is saved into redux state under
  // "duration", and only then we can calculate desired progress interval - the longer the track is, the
  // less frequent progress update event we'll have.
  const resolvedProgressUpdateEventInterval = useMemo(
    () => calculateProgressInterval(savedProgress.duration ?? 0),
    [savedProgress.duration],
  );

  const updateOptions = useMemo(
    () => ({
      ...PLAYER_OPTIONS,
      progressUpdateEventInterval: resolvedProgressUpdateEventInterval,
    }),
    [resolvedProgressUpdateEventInterval],
  );

  const {
    isActivePlayer,
    playback,
    position: livePosition,
    duration,
    onPlaybackButtonPress,
    onSeekComplete,
  } = usePlayer({
    tracks: [track],
    updateOptions,
    onQueueChange: handleSeekBeforePlaying,
  });

  useEffect(() => {
    // This ensures that 100% progress is saved in the state. This is necessary because we update the progress every X seconds
    // when the progress update event is fired. If X is too high, we might fail to update the progress to 100%, which is important
    // for the user.
    // We also want to skip updating the progress during the transition to another track (e.g., radio). During the transition, this
    // track is reset to position 0, and we keep receiving falsy progress updates from the progress hook until the new active
    // track is mounted. Only after this transition process do we stop receiving progress updates.
    // Additionally, 2 seconds is the minimum allowed interval for receiving progress update events.
    if (
      livePosition > 2 &&
      convertSecondsToTimeDisplay(Math.floor(livePosition)) ===
        convertSecondsToTimeDisplay(Math.floor(duration)) &&
      // Prevent action dispatch X times. It happens because progress hook updates every 100ms, and progress update event
      // interval can be anywhere between 2 and X seconds (15 by default).
      savedProgress.position !== livePosition
    ) {
      dispatch(updateAudioTrackProgress(ext(), track.id, duration, duration));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [livePosition, duration, savedProgress.position]);

  const isActiveAndPlaying = useMemo(
    () => isActivePlayer && playback.state === State.Playing,
    [isActivePlayer, playback.state],
  );

  // If episode progress wasn't saved into redux state before, wait for duration to be resolved in RNTP, then
  // save initial state - indicating, in future, that episode has been played at least once before.
  useEffect(() => {
    if (isActiveAndPlaying && !!duration && !savedProgress.duration) {
      dispatch(
        updateAudioTrackProgress(ext(), track.id, livePosition, duration),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveAndPlaying, duration]);

  const isLoadingOrBuffering = useMemo(
    () =>
      isActivePlayer &&
      (playback.state === State.Loading || playback.state === State.Buffering),
    [isActivePlayer, playback.state],
  );

  const resolvedPosition = useMemo(
    () => (isActivePlayer ? livePosition : savedProgress.position ?? 0),
    [isActivePlayer, livePosition, savedProgress.position],
  );

  return {
    isActivePlayer,
    isActiveAndPlaying,
    isLoadingOrBuffering,
    position: resolvedPosition,
    duration: savedProgress.duration,
    onPlaybackButtonPress,
    onSeekComplete,
  };
};
