import pack from './package.json';

export const UPDATE_AUDIO_TRACK_PROGRESS = ext('UPDATE_AUDIO_TRACK_PROGRESS');

export const STOP_PLAYBACK_TYPE = {
  PAUSE: 'pause',
  STOP: 'stop',
};

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
