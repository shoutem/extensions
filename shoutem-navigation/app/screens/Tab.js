import React from 'react';
import { connect } from 'react-redux';

import {
  ScreenStack,
  isEmptyNavigationState,
  navigateBack,
} from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { loginRequired } from 'shoutem.auth';
import { executeShortcut } from 'shoutem.application';
import { ext } from '../const';
import { getTabNavigationStack, getTabNavigationState } from '../redux';

class Tab extends React.Component {
  static propTypes = {
    shortcut: React.PropTypes.object.isRequired,
    navigationState: React.PropTypes.object,
    executeShortcut: React.PropTypes.func,
    navigateBack: React.PropTypes.func,
  };

  componentWillMount() {
    const { navigationState, shortcut, executeShortcut } = this.props;
    if (isEmptyNavigationState(navigationState)) {
      const navigationStack = getTabNavigationStack(shortcut.id);
      executeShortcut(shortcut.id, undefined, navigationStack);
    }
  }

  render() {
    const { navigationState, navigateBack } = this.props;
    let screenContent = null;
    if (!isEmptyNavigationState(navigationState)) {
      screenContent = (
        <ScreenStack
          navigationState={navigationState}
          onNavigateBack={navigateBack}
        />
      );
    }

    return (
      <Screen>
        <NavigationBar hidden />
        {screenContent}
      </Screen>
    );
  }
}

const mapStateToProps = (state, { shortcut }) => ({
  navigationState: getTabNavigationState(state, shortcut.id),
});
const mapDispatchToProps = { executeShortcut, navigateBack };


export default loginRequired(
  connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('Tab'))(Tab)),
  false
);
