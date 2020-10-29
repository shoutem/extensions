import { combineReducers } from 'redux';
import { SET_LOCALE } from './actions';

const selectedLocale = (state = '', action) => {
  if (action.type === SET_LOCALE) {
    return action.payload;
  }

  return state;
};

export default combineReducers({ selectedLocale });
