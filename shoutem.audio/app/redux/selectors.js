import { ext } from '../const';

function getModuleState(state) {
  return state[ext()];
}
export function getAudioTrackProgress(state, extensionCanonicalName, trackId) {
  const { position, duration } =
    getModuleState(state)?.audioTrackProgress?.[extensionCanonicalName]?.[
      trackId
    ] ?? {};

  return {
    position,
    duration,
    completionPercentage:
      position && duration
        ? parseFloat(((position / duration) * 100).toFixed(2))
        : 0,
  };
}
