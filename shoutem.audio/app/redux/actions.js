import {
  AUDIO_PLAYER_BANNER_CHANGED,
  SET_SLEEP_TIMER,
  UPDATE_ACTIVE_AUDIO_SOURCE,
  UPDATE_AUDIO_TRACK_PROGRESS,
} from '../const';

export const updateAudioTrackProgress = (
  extensionCanonicalName,
  trackId,
  position,
  duration,
) => ({
  type: UPDATE_AUDIO_TRACK_PROGRESS,
  payload: { extensionCanonicalName, trackId, position, duration },
});

export const setBannerShown = payload => ({
  type: AUDIO_PLAYER_BANNER_CHANGED,
  payload,
});

export const updateActiveSource = payload => ({
  type: UPDATE_ACTIVE_AUDIO_SOURCE,
  payload,
});

export const setSleepTimer = payload => ({
  type: SET_SLEEP_TIMER,
  payload,
});
