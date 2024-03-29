import {
  AUDIO_PLAYER_BANNER_CHANGED,
  SET_ACTIVE_PLAYLIST_OR_STREAM,
  UPDATE_AUDIO_TRACK_PROGRESS,
} from '../const';

export const updateAudioTrackProgress = (
  extensionCanonicalName,
  trackId,
  position,
  duration,
) => {
  return {
    type: UPDATE_AUDIO_TRACK_PROGRESS,
    payload: { extensionCanonicalName, trackId, position, duration },
  };
};

export const setBannerShown = payload => ({
  type: AUDIO_PLAYER_BANNER_CHANGED,
  payload,
});

export const setActivePlaylistOrStream = payload => ({
  type: SET_ACTIVE_PLAYLIST_OR_STREAM,
  payload,
});
