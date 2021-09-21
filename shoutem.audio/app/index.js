import TrackPlayer from 'react-native-track-player';
import { trackPlayerService } from './services/trackPlayerService';
import TrackPlayerBase from './components/TrackPlayerBase';
import { destroyTrackPlayerMiddleware } from './middleware';

const middleware = [destroyTrackPlayerMiddleware];

// Constants `screens` (from extension.js) and `reducer` (from index.js)
// are exported via named export
// It is important to use those exact names

// list of exports supported by shoutem can be found here: https://shoutem.github.io/docs/extensions/reference/extension-exports
export * from './middleware';

export function appWillMount() {
  trackPlayerService.register();
}

export function appWillUnmount() {
  trackPlayerService.destroy();
}

export {
  CAPABILITY_PAUSE,
  CAPABILITY_PLAY,
  CAPABILITY_STOP,
  CAPABILITY_NEXT,
  CAPABILITY_PREVIOUS,
  CAPABILITY_JUMP_FORWARD,
  CAPABILITY_JUMP_BACKWARD,
  CAPABILITY_SEEK_TO,
  STATE_NONE, // 0 idle
  STATE_STOPPED, // 1 idle
  STATE_PAUSED, // 2 paused
  STATE_PLAYING, // 3 playing
  STATE_READY, // undefined ready
  STATE_BUFFERING, // 6 buffering,
  STATE_CONNECTING, // 8 connecting
} from './const';

export { TrackPlayer, TrackPlayerBase };
export { useProgress } from 'react-native-track-player';

export { middleware };
