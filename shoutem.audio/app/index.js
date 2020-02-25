import {
  destroyTrackPlayer,
  registerTrackPlayerService,
} from './services/trackPlayer';
import { destroyTrackPlayerMiddleware } from './middleware';

const middleware = [
  destroyTrackPlayerMiddleware,
];

// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
export TrackPlayerBase from './components/TrackPlayerBase';
export * from './middleware';

export function appWillMount() {
  registerTrackPlayerService();
}

export function appWillUnmount() {
  destroyTrackPlayer();
}

export {
  CAPABILITY_PAUSE,
  CAPABILITY_PLAY,
  CAPABILITY_STOP,
  STATE_NONE, // 0 idle
  STATE_STOPPED, // 1 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_BUFFERING, // 6 buffering,
  STATE_CONNECTING, // 8 connecting
} from './const';

export TrackPlayer from 'react-native-track-player';
export { useProgress } from 'react-native-track-player';

export { middleware };
