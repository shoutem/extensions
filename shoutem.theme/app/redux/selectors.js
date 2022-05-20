import _ from 'lodash';
import { createSelector } from 'reselect';
import { getConfiguration } from 'shoutem.application/redux';
import { isConfigurationLoaded } from 'shoutem.application/shared/isConfigurationLoaded';
import { ext } from '../const';

function getExtensionState(state) {
  return state[ext()];
}

/**
 * A selector that returns active theme from configuration.
 * @param state
 * @returns {V}
 */
export function getActiveTheme(state) {
  const configuration = getConfiguration(state);
  const selectedTheme = getSelectedTheme(state);
  const activeTheme =
    selectedTheme || configuration.activeTheme || configuration.defaultTheme;
  if (!activeTheme && isConfigurationLoaded(state)) {
    throw Error('Neither active or default theme provided in configuration.');
  }
  return activeTheme;
}

/**
 * A selector that returns default theme from configuration.
 * @param state
 * @returns {V}
 */
export function getDefaultTheme(state) {
  return getConfiguration(state).defaultTheme;
}

export const getAllThemes = createSelector(
  [getConfiguration],
  configuration => configuration.themes,
);

export function hasSelectedTheme(state) {
  return !!getExtensionState(state).selectedTheme;
}

export const getTheme = createSelector(
  [getAllThemes, (_state, themeId) => themeId],
  (themes, themeId) => _.find(themes, { id: themeId }),
);

export function getAppStyle(state) {
  return getExtensionState(state).appStyle;
}

export function getThemeResolvers(state) {
  return getExtensionState(state).themeResolvers;
}

export function getSelectedTheme(state) {
  return getTheme(state, getExtensionState(state).selectedTheme);
}
