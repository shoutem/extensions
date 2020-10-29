import i18next from 'i18next';
import LOCALIZATION from './localization';

import {
  LOAD_FIREBASE_CONFIG_SUCCESS,
  LOAD_FIREBASE_CONFIG_ERROR,
  UPDATE_FIREBASE_CONFIG_SUCCESS,
  UPDATE_FIREBASE_CONFIG_ERROR,
} from './actions';

const initialState = {
  configLoaded: false,
  error: null,
  config: {},
};

export default function firebaseReducer(state = initialState, action) {
  switch (action.type) {
    case LOAD_FIREBASE_CONFIG_SUCCESS:
    case UPDATE_FIREBASE_CONFIG_SUCCESS:
      return {
        ...state,
        configLoaded: true,
        config: action.payload,
      };
    case LOAD_FIREBASE_CONFIG_ERROR:
    case UPDATE_FIREBASE_CONFIG_ERROR:
      return {
        ...state,
        configLoaded: true,
        error: i18next.t(LOCALIZATION.ERROR_MESSAGE),
      };
    default:
      return state;
  }
}
