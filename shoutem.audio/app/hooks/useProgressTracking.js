import { useEffect, useMemo } from 'react';
import TrackPlayer, {
  useActiveTrack,
  useProgress,
} from 'react-native-track-player';
import { useDispatch, useSelector } from 'react-redux';
import { getAudioTrackProgress, updateAudioTrackProgress } from '../redux';
import { calculateProgressInterval } from '../services';
import { useTrackState } from './useTrackState';

export const useProgressTracking = ({ track } = {}) => {
  const dispatch = useDispatch();

  const activeTrack = useActiveTrack();
  // track can be undefined in cases when we're using this hook always for active track.
  const resolvedTrack = track ?? activeTrack;

  const { position: livePosition, duration } = useProgress();

  const savedProgress = useSelector(state =>
    getAudioTrackProgress(
      state,
      resolvedTrack?.extensionCanonicalName,
      resolvedTrack?.id,
    ),
  );

  // Set 2 seconds interval as base. Once track's duration is fetched, it is saved into redux state under
  // "duration", and only then we can calculate desired progress interval - the longer the track is, the
  // less frequent progress update event we'll have.
  const progressUpdateEventInterval = useMemo(
    () => calculateProgressInterval(savedProgress.duration ?? 0),
    [savedProgress.duration],
  );

  const seekToInitialPosition = async () => {
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

  const { isActive, isActiveAndPlaying } = useTrackState({ track });

  // If episode progress wasn't saved into redux state before, wait for duration to be resolved in RNTP, then
  // save initial state - indicating, in future, that episode has been played at least once before.
  useEffect(() => {
    if (isActiveAndPlaying && !!duration && !savedProgress.duration) {
      dispatch(
        updateAudioTrackProgress(
          resolvedTrack?.extensionCanonicalName,
          resolvedTrack?.id,
          livePosition,
          duration,
        ),
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActiveAndPlaying, duration]);

  const resolvedPosition = useMemo(
    () => (isActive ? livePosition : savedProgress.position ?? 0),
    [isActive, livePosition, savedProgress.position],
  );

  return {
    position: resolvedPosition,
    duration: savedProgress.duration,
    progressUpdateEventInterval,
    seekToInitialPosition,
  };
};
