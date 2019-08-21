import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';

import { getFirstShortcut } from 'shoutem.application/shared/getFirstShortcut';

import { navigateTo } from '../redux/core';
import NoScreens from '../screens/NoScreens';
import NoContent from '../screens/NoContent';
import { ext } from '../const';
import mapExtensionSettingsToProps from './mapExtensionSettingsToProps';

/**
 * Navigation shortcuts, such as Drawer, Folder, TabBar, must have child shortcuts.
 * Use it as a fallback for navigation screen if shortcuts (children) are missing.
 */
class ShortcutChildrenRequired extends PureComponent {
  constructor(props) {
    super(props);

    this.isRootScreen = props.firstShortcut === props.shortcut;
  }

  isShortcutVisible(shortcutId) {
    const { hiddenShortcuts } = this.props;

    return !_.find(hiddenShortcuts, (id) => shortcutId === id);
  }

  render() {
    const {
      WrappedComponent,
      shortcut,
    } = this.props;

    // Folder screen may not be root screen and if it has no children
    // we present error as there is no content.
    if (_.isEmpty(shortcut.children)) {
      if (this.isRootScreen) {
        return <NoScreens />;
      }

      return <NoContent title={shortcut.title} />;
    }

    const shortcutWithVisibleChildrenOnly = {
      ...shortcut,
      children: _.filter(shortcut.children, (s) => this.isShortcutVisible(s.id)),
    };

    return (
      <WrappedComponent
        {...this.props}
        shortcut={shortcutWithVisibleChildrenOnly}
      />
    );
  }
}

ShortcutChildrenRequired.propTypes = {
  shortcut: PropTypes.object.isRequired,
  firstShortcut: PropTypes.object,
  hiddenShortcuts: PropTypes.array,
  WrappedComponent: PropTypes.func,
};

const mapStateToProps = (state) => ({
  firstShortcut: getFirstShortcut(state),
  hiddenShortcuts: state[ext()].hiddenShortcuts,
  ...mapExtensionSettingsToProps(state),
});

const mapDispatchToProps = {
  navigateTo,
};

const ConnectedShortcutChildrenRequired =
  connect(mapStateToProps, mapDispatchToProps)(ShortcutChildrenRequired);

export default (WrappedComponent) => props =>
  <ConnectedShortcutChildrenRequired {...props} WrappedComponent={WrappedComponent} />;
