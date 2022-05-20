import React from 'react';
import { Appearance } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import { StyleProvider } from '@shoutem/theme';
import {
  getConfiguration,
  getExtensionSettings,
  setQueueTargetComplete,
} from 'shoutem.application';
import { after, priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import {
  getActiveTheme,
  getAllThemes,
  getAppStyle,
  getThemeResolvers,
  hasSelectedTheme,
  selectTheme,
  setAppStyle,
  setThemeResolvers,
} from './redux';
import { appThemeAssets, resolveThemeStyle } from './services';

export function appWillMount(app) {
  const store = app.getStore();
  const { dispatch } = store;
  const themeResolvers = app.getThemes();

  dispatch(setThemeResolvers(themeResolvers));
}

export function appDidMount(app) {
  const store = app.getStore();
  const { dispatch, getState } = store;
  const state = getState();

  const configuration = getConfiguration(state);
  const settings = getExtensionSettings(state, ext());
  const colorScheme = Appearance.getColorScheme();

  // colorScheme can be undefined. Theme IDs have to be set if
  // autoSelectEnabled flag is true ( controled via settings page ).
  if (settings.autoSelectEnabled && !hasSelectedTheme(state) && colorScheme) {
    const resolvedThemeId =
      colorScheme === 'dark' ? settings.darkThemeId : settings.lightThemeId;
    dispatch(selectTheme(resolvedThemeId));
    dispatch(setQueueTargetComplete(ext()));
    return;
  }

  if (!hasSelectedTheme(state)) {
    const allThemes = getAllThemes(state);
    const defaultTheme =
      configuration.activeTheme || configuration.defaultTheme;

    const newTheme = _.find(allThemes, theme => {
      return theme.canonicalName === defaultTheme.id;
    });

    dispatch(selectTheme(newTheme.id));
    dispatch(setQueueTargetComplete(ext()));
    return;
  }

  const theme = getActiveTheme(state);
  const themeResolvers = getThemeResolvers(state);
  const themeStyle = resolveThemeStyle(theme, themeResolvers);

  dispatch(setAppStyle(themeStyle));

  appThemeAssets.updateActiveIconsMap(configuration.defaultTheme, theme);
  dispatch(setQueueTargetComplete(ext()));
}

function styleProvider({ children, style }) {
  // StyleProvider requires singular child
  const resolvedChidren = _.isArray(children) ? _.head(children) : children;

  return <StyleProvider style={style}>{resolvedChidren}</StyleProvider>;
}

const mapStateToProps = state => ({
  style: getAppStyle(state),
});

const StyledProvider = connect(mapStateToProps, null)(styleProvider);

export const renderProvider = setPriority(children => {
  return <StyledProvider>{children}</StyledProvider>;
}, after(priorities.REDUX));
