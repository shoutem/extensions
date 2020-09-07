import {
  CAPABILITY_PAUSE,
  CAPABILITY_PLAY,
  CAPABILITY_JUMP_FORWARD,
  CAPABILITY_JUMP_BACKWARD,
  CAPABILITY_SEEK_TO,
} from 'shoutem.audio';

import pack from './package.json';

export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}

export const trackPlayerOptions = {
  stopWithApp: true,
  alwaysPauseOnInterruption: true,
  capabilities: [
    CAPABILITY_SEEK_TO,
    CAPABILITY_JUMP_FORWARD,
    CAPABILITY_JUMP_BACKWARD,
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
  notificationCapabilities: [
    CAPABILITY_SEEK_TO,
    CAPABILITY_JUMP_FORWARD,
    CAPABILITY_JUMP_BACKWARD,
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
  compactCapabilities: [
    CAPABILITY_SEEK_TO,
    CAPABILITY_JUMP_FORWARD,
    CAPABILITY_JUMP_BACKWARD,
    CAPABILITY_PLAY,
    CAPABILITY_PAUSE,
  ],
};
