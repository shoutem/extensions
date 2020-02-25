import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

import { executeShortcut } from 'shoutem.application/redux';

import {
  replace,
  REPLACE,
  ROOT_NAVIGATION_STACK,
} from '../redux/core';
import { NO_SCREENS_ROUTE } from '../const';

class None extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object.isRequired,
    executeShortcut: PropTypes.func,
    replace: PropTypes.func,
  };

  componentDidMount() {
    const { shortcut, replace, executeShortcut } = this.props;

    const children = shortcut.children || [];

    if (!children[0]) {
      replace(NO_SCREENS_ROUTE, ROOT_NAVIGATION_STACK);
      return;
    }

    const shortcutId = children[0].id;

    executeShortcut(shortcutId, REPLACE);
  }

  render() {
    return null;
  }
}

export default connect(undefined, { executeShortcut, replace })(None);
