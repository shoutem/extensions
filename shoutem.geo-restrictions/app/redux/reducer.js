import { combineReducers } from 'redux';
import { SET_CURRENT_LOCATION } from './actions';

const initialState = {
  country: null,
  state: null,
  missingPermissions: false
};

const userCurrentLocation = (state = initialState, action) => {
  if (action.type === SET_CURRENT_LOCATION) {
    return { ...state, ...action.payload }
  }

  return state;
};

export default combineReducers({ userCurrentLocation });
