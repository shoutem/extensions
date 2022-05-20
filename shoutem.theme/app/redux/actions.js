import { getConfiguration } from 'shoutem.application';
import { ext } from '../const';
import { appThemeAssets, resolveThemeStyle } from '../services';
import { getTheme, getThemeResolvers } from './selectors';

export const SELECT_THEME = ext('SELECT_THEME');
export const SET_APP_STYLE = ext('SET_APP_STYLE');
export const SET_THEME_RESOLVERS = ext('SET_THEME_RESOLVERS');

export function selectTheme(themeId) {
  return (dispatch, getState) => {
    const state = getState();
    const configuration = getConfiguration(state);
    const themeResolvers = getThemeResolvers(state);
    const newTheme = getTheme(state, themeId);
    const themeStyle = resolveThemeStyle(newTheme, themeResolvers);

    dispatch(setAppStyle(themeStyle));

    appThemeAssets.updateActiveIconsMap(configuration.defaultTheme, newTheme);

    dispatch({
      type: SELECT_THEME,
      payload: themeId,
    });
  };
}

export function setAppStyle(style) {
  return {
    type: SET_APP_STYLE,
    payload: style,
  };
}

export function setThemeResolvers(resolvers) {
  return {
    type: SET_THEME_RESOLVERS,
    payload: resolvers,
  };
}
