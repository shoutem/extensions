import { combineReducers } from 'redux';
import { SET_RESET_WEB_VIEW_CALLBACK } from './actions';

const resetWebViewCallback = (state = {}, action) => {
  if (action.type === SET_RESET_WEB_VIEW_CALLBACK) {
    const { shortcutId, onReset } = action.payload;

    return {
      ...state,
      [shortcutId]: onReset,
    };
  }

  return state;
};

export default combineReducers({
  resetWebViewCallback,
});
