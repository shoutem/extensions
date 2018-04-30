import PropTypes from 'prop-types';
import React from 'react';
import _ from 'lodash';
import { connect } from 'react-redux';

import { navigateTo } from '@shoutem/core/navigation';
import { isShortcutVisible } from 'shoutem.application';

import NoScreens from '../screens/NoScreens';
import NoContent from '../screens/NoContent';
import mapIsRootScreenToProps from './mapIsRootScreenToProps';
import mapExtensionSettingsToProps from './mapExtensionSettingsToProps';

/**
 * Navigation shortcuts, such as Drawer, Folder, TabBar, must have child shortcuts.
 * Use it as a fallback for navigation screen if shortcuts (children) are missing.
 */
function ShortcutChildrenRequired(props) {
  const { WrappedComponent, shortcut, isRootScreen } = props;

  // Folder screen may not be root screen and if it has no children
  // we present error as there is no content.
  const fallbackScreen = isRootScreen ? <NoScreens /> : <NoContent title={shortcut.title} />;

  return _.isEmpty(shortcut.children) ?
    fallbackScreen :
    <WrappedComponent {...props} />;
}

ShortcutChildrenRequired.propTypes = {
  shortcut: PropTypes.object.isRequired,
  isRootScreen: PropTypes.bool,
  WrappedComponent: PropTypes.func,
};

const mapStateToProps = (state, ownProps) => ({
  ...mapIsRootScreenToProps(state, ownProps),
  ...mapExtensionSettingsToProps(state, ownProps),
  shortcut: {
    ...ownProps.shortcut,
    children: _.filter(ownProps.shortcut.children, (s) => isShortcutVisible(state, s.id))
  },
});

const ConnectedShortcutChildrenRequired =
  connect(mapStateToProps, { navigateTo })(
  ShortcutChildrenRequired
);

export default (WrappedComponent) => props =>
  <ConnectedShortcutChildrenRequired {...props} WrappedComponent={WrappedComponent} />;
