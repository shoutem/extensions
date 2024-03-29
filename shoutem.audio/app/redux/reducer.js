import _ from 'lodash';
import { combineReducers } from 'redux';
import { REHYDRATE } from 'redux-persist/constants';
import {
  AUDIO_PLAYER_BANNER_CHANGED,
  ext,
  SET_ACTIVE_PLAYLIST_OR_STREAM,
  UPDATE_AUDIO_TRACK_PROGRESS,
} from '../const';

const audioTrackProgress = (state = {}, action) => {
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

const audioPlayerBannerShown = (state = false, action) => {
  if (action.type === AUDIO_PLAYER_BANNER_CHANGED) {
    const { payload = false } = action;

    return payload;
  }

  return state;
};

const activePlaylistOrStream = (state = null, action) => {
  if (action.type === SET_ACTIVE_PLAYLIST_OR_STREAM) {
    const { payload = false } = action;

    return payload;
  }

  return state;
};

export default combineReducers({
  audioTrackProgress,
  activePlaylistOrStream,
  audioPlayerBannerShown,
});
