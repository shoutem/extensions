import { combineReducers } from 'redux';
import { preventStateRehydration } from 'shoutem.redux';
import { SET_NAVIGATION_INITIALIZED } from './actions';

const navigationInitialized = (state = false, action) => {
  if (action.type === SET_NAVIGATION_INITIALIZED) {
    return true;
  }

  return state;
};

const reducer = combineReducers({
  navigationInitialized,
});

export default preventStateRehydration(reducer);
