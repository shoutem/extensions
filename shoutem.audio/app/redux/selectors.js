import { ext } from '../const';

const getModuleState = state => {
  return state[ext()];
};

export const getAudioTrackProgress = (
  state,
  extensionCanonicalName,
  trackId,
) => {
  const { position, duration } =
    getModuleState(state)?.audioTrackProgress?.[extensionCanonicalName]?.[
      trackId
    ] ?? {};

  return {
    position,
    duration,
    completionPercentage:
      position > 0 && duration > 0
        ? parseFloat(((position / duration) * 100).toFixed(2))
        : 0,
  };
};

export const getBannerShown = state => getModuleState(state).bannerShown;

export const getActiveSource = state => getModuleState(state).activeSource;

export const getSleepTimer = state => getModuleState(state).sleepTimer;
