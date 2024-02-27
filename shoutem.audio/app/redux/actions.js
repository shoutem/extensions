import { UPDATE_AUDIO_TRACK_PROGRESS } from '../const';

export function updateAudioTrackProgress(
  extensionCanonicalName,
  trackId,
  position,
  duration,
) {
  return {
    type: UPDATE_AUDIO_TRACK_PROGRESS,
    payload: { extensionCanonicalName, trackId, position, duration },
  };
}
