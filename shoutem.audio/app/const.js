import pack from './package.json';

export const UPDATE_AUDIO_TRACK_PROGRESS = ext('UPDATE_AUDIO_TRACK_PROGRESS');
export const AUDIO_PLAYER_BANNER_CHANGED = ext('AUDIO_PLAYER_BANNER_CHANGED');

export const SET_ACTIVE_PLAYLIST_OR_STREAM = ext(
  'SET_ACTIVE_PLAYLIST_OR_STREAM',
);

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
