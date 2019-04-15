import _ from 'lodash';
import React from 'react';

import { StyleProvider } from '@shoutem/theme';
import { getConfiguration } from 'shoutem.application';
import { getActiveTheme } from './redux';
import { appThemeAssets } from './services/AppThemeAssets';

let appInstance;

/**
 * Resolves given theme style.
 * @param theme Denormalized theme object from state
 * @param app Application instance
 * @returns {*} Resolved theme style
 */
function resolveThemeStyle(theme, app) {
  const themes = app.getThemes();
  const initTheme = themes[theme.canonicalName];

  if (!initTheme) {
    throw Error(
      `Resolving "${theme.canonicalName}" but couldn't be found in application.` +
      'This usually happen when theme extension is not installed.'
    );
  } else if (!_.isFunction(initTheme)) {
    throw Error(`Theme "${theme.canonicalName}" is not exporting a function.`);
  }

  const variables = _.get(theme, 'settings.variables');

  return initTheme(variables);
}

/**
 * Update theme assets with configuration default and active theme assets.
 * @param configuration Denormalized configuration
 */
function updateThemeAssets(configuration) {
  if (!configuration) {
    return;
  }
  appThemeAssets.updateActiveIconsMap(configuration.defaultTheme, configuration.activeTheme);
}

export const appWillMount = function (app) {
  appInstance = app;
};

export const appDidMount = function (app) {
  const state = app.getState();
  const configuration = getConfiguration(state);
  const theme = getActiveTheme(state);
  const themeStyle = resolveThemeStyle(theme, app);

  app.setStyle(themeStyle);

  // Active theme is always taken from configuration.activeTheme
  updateThemeAssets(configuration);
};

export function renderProvider(children) {
  return (
    <StyleProvider style={appInstance.getStyle()}>
      {children}
    </StyleProvider>
  );
}
