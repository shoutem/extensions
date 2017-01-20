import React from 'react';
import { executeShortcut } from 'shoutem.application';
import { connect } from 'react-redux';
import {
  navigateTo,
  NavigationOperations,
  ROOT_NAVIGATION_STACK,
} from '@shoutem/core/navigation';
import { NO_SCREENS_ROUTE } from '../const';

class None extends React.Component {
  static propTypes = {
    shortcut: React.PropTypes.object.isRequired,
    executeShortcut: React.PropTypes.func,
    navigateTo: React.PropTypes.func,
  };
  componentWillMount() {
    const { shortcut, navigateTo, executeShortcut } = this.props;
    const children = shortcut.children || [];

    if (!children[0]) {
      navigateTo(NO_SCREENS_ROUTE, NavigationOperations.REPLACE, ROOT_NAVIGATION_STACK);
      return;
    }

    const shortcutId = children[0].id;

    executeShortcut(shortcutId, NavigationOperations.REPLACE);
  }

  render() {
    return null;
  }
}
export default connect(undefined, { executeShortcut, navigateTo })(None);
