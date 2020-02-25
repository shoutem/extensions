import { Platform } from 'react-native';
import { Capability, State } from 'react-native-track-player';
import pack from './package.json';

export const CAPABILITY_PLAY = Capability.Play;
export const CAPABILITY_PAUSE = Capability.Pause;
export const CAPABILITY_STOP = Capability.Stop;

export const STATE_NONE = State.None;
export const STATE_STOPPED = State.Stopped;
export const STATE_PAUSED = State.Paused;
export const STATE_PLAYING = State.Playing;
export const STATE_READY = State.Ready;
export const STATE_BUFFERING = State.Buffering;
export const STATE_CONNECTING = State.Connecting;

// defines scope for the current extension state within the global app's state
export function ext(resourceName) {
  return resourceName ? `${pack.name}.${resourceName}` : pack.name;
}
