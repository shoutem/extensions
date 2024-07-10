import pack from './package.json';

export const AUDIO_SOURCE_TYPE = {
  TRACK: 'track',
  PLAYLIST: 'playlist',
  LIVE_STREAM: 'liveStream',
};

// Actions
export const UPDATE_AUDIO_TRACK_PROGRESS = ext('UPDATE_AUDIO_TRACK_PROGRESS');
export const AUDIO_PLAYER_BANNER_CHANGED = ext('AUDIO_PLAYER_BANNER_CHANGED');

export const SET_SLEEP_TIMER = ext('SET_SLEEP_TIMER');
export const UPDATE_ACTIVE_AUDIO_SOURCE = ext('UPDATE_ACTIVE_AUDIO_SOURCE');

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
