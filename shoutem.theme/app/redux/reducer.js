import { combineReducers } from 'redux';
import { storage } from '@shoutem/redux-io';
import { THEMES_SCHEMA } from '../const';
import { SELECT_THEME, SET_APP_STYLE, SET_THEME_RESOLVERS } from './actions';

function selectedTheme(state = null, action) {
  if (action.type === SELECT_THEME) {
    return action.payload;
  }

  return state;
}

function appStyle(state = {}, action) {
  if (action.type === SET_APP_STYLE) {
    return action.payload;
  }

  return state;
}

function themeResolvers(state = {}, action) {
  if (action.type === SET_THEME_RESOLVERS) {
    return action.payload;
  }

  return state;
}

export default combineReducers({
  themes: storage(THEMES_SCHEMA),
  selectedTheme,
  appStyle,
  themeResolvers,
});
