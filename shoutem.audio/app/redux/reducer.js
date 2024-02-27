import _ from 'lodash';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import { ext, UPDATE_AUDIO_TRACK_PROGRESS } from '../const';

const audioTrackProgress = (state = [], action) => {
  if (action.type === REHYDRATE) {
    return _.get(action, ['payload', ext(), 'audioTrackProgress'], {});
  }

  if (action.type === UPDATE_AUDIO_TRACK_PROGRESS) {
    const {
      payload: { extensionCanonicalName, trackId, position, duration },
    } = action;

    return {
      ...state,
      [extensionCanonicalName]: {
        ...state[extensionCanonicalName],
        [trackId]: { position, duration },
      },
    };
  }

  return state;
};

export default combineReducers({ audioTrackProgress });
