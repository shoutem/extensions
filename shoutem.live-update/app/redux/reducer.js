import { combineReducers } from 'redux';
import { SET_CURRENT_UPDATE_VERSION } from './actions';

const currentUpdateVersion = (state = 1, action) => {
  if (action.type === SET_CURRENT_UPDATE_VERSION) {
    return action.payload;
  }

  return state;
};

const reducer = combineReducers({
  currentUpdateVersion,
});

export default reducer;
