import TrackPlayer from 'react-native-track-player';

import { RESTART_APP } from 'shoutem.application';
import { before, priorities, setPriority } from 'shoutem-core';

import { destroyTrackPlayer } from './services/trackPlayer';

export const destroyTrackPlayerMiddleware = setPriority(store => next => (action) => {
  if (action.type === RESTART_APP) {
    // if we're restarting the app, destroy the track player
    destroyTrackPlayer();
  }

  return next(action);
}, before(priorities.AUTH));
