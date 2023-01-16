import React from 'react';
import { Image } from 'react-native';
import { connect } from 'react-redux';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { getAllShortcuts, getFirstShortcut } from 'shoutem.application';
import { getExtensionSettings } from 'shoutem.application/redux';
import { priorities, setPriority } from 'shoutem-core';
import { ext } from './const';
import { RouteConfigProvider } from './providers';

const NavigationProvider = ({
  settings,
  shortcuts,
  firstShortcut,
  screens,
}) => {
  const hasNavBarImage = !_.isEmpty(settings.backgroundImage);

  if (hasNavBarImage) {
    Image.prefetch(settings.backgroundImage);
  }

  return (
    <RouteConfigProvider
      key="route_provider"
      screens={screens}
      shortcuts={shortcuts}
      firstShortcut={firstShortcut}
      navBarSettings={settings}
    />
  );
};

NavigationProvider.propTypes = {
  screens: PropTypes.object.isRequired,
  firstShortcut: PropTypes.object,
  settings: PropTypes.object,
  shortcuts: PropTypes.array,
};

NavigationProvider.defaultProps = {
  settings: {},
  shortcuts: [],
  firstShortcut: undefined,
};

const ConnectedNavigationProvider = connect(
  mapStateToProps,
  null,
)(NavigationProvider);

function mapStateToProps(state) {
  return {
    settings: getExtensionSettings(state, ext()),
    shortcuts: getAllShortcuts(state),
    firstShortcut: getFirstShortcut(state),
  };
}

export const render = setPriority(app => {
  const screens = app.getScreens();

  return <ConnectedNavigationProvider screens={screens} />;
}, priorities.NAVIGATION);
