import React, { PureComponent } from 'react';
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ext as applicationExt } from 'shoutem.application';
import { getFirstShortcut } from 'shoutem.application/shared/getFirstShortcut';
import NoScreens from '../screens/NoScreens';
import NoContent from '../screens/NoContent';
import { mapExtensionSettingsToProps } from '../redux';

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

    return !_.find(hiddenShortcuts, id => shortcutId === id);
  }

  render() {
    const { WrappedComponent, shortcut } = this.props;

    // Folder screen may not be root screen and if it has no children
    // we present error as there is no content.
    // Page screen will have a parentCategory, and should handle its
    // own no-content state, so it should be rendered.
    const hasParentCategory = _.get(shortcut, 'settings.parentCategory');
    if (_.isEmpty(shortcut.children) && !hasParentCategory) {
      if (this.isRootScreen) {
        return <NoScreens />;
      }

      return <NoContent title={shortcut.title} />;
    }

    const shortcutWithVisibleChildrenOnly = {
      ...shortcut,
      children: _.filter(shortcut.children, s => this.isShortcutVisible(s.id)),
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
  WrappedComponent: PropTypes.elementType,
};

const mapStateToProps = (state, ownProps) => ({
  shortcut: _.get(ownProps, 'route.params.shortcut'),
  firstShortcut: getFirstShortcut(state),
  hiddenShortcuts: state[applicationExt()].hiddenShortcuts,
  ...mapExtensionSettingsToProps(state),
});

const ConnectedShortcutChildrenRequired = connect(mapStateToProps)(
  ShortcutChildrenRequired,
);

export function withChildrenRequired(WrappedComponent) {
  return props => (
    <ConnectedShortcutChildrenRequired
      {...props}
      WrappedComponent={WrappedComponent}
    />
  );
}
