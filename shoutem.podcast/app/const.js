import {
  CAPABILITY_PAUSE,
  CAPABILITY_PLAY,
} from 'shoutem.audio';

import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const trackPlayerOptions = {
  stopWithApp: true,
  alwaysPauseOnInterruption: true,
  capabilities: [
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
  notificationCapabilities: [
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
  compactCapabilities: [
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
};
