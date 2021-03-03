import { CAPABILITY_PAUSE, CAPABILITY_PLAY } from 'shoutem.audio';

import pack from './package.json';

export const trackPlayerOptions = {
  stopWithApp: true,
  alwaysPauseOnInterruption: true,
  isLiveStreamSource: true,
  capabilities: [CAPABILITY_PLAY, CAPABILITY_PAUSE],
  notificationCapabilities: [CAPABILITY_PLAY, CAPABILITY_PAUSE],
  compactCapabilities: [CAPABILITY_PLAY, CAPABILITY_PAUSE],
};

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
