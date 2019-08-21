import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { InteractionManager } from 'react-native';
import { connect } from 'react-redux';

import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';

import { executeShortcut } from 'shoutem.application/redux';

import { ScreenStack } from '../components/stacks';
import { NavigationBar } from '../components/ui';
import { isEmptyNavigationState, navigateBack } from '../redux/core';
import { getTabNavigationStateFromTabBarState } from '../redux';
import { ext } from '../const';

class Tab extends PureComponent {
  static propTypes = {
    shortcut: PropTypes.object.isRequired,
    executeShortcut: PropTypes.func,
    navigateBack: PropTypes.func,
  };

  constructor(props) {
    super(props);

    this.state = {
      // Renders an empty view until the interaction is complete
      shouldRenderContent: false,
    };
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      this.setState({
        shouldRenderContent: true,
      });
    });
  }

  getTabNavigationState() {
    const { tabStates, shortcut } = this.props;

    return getTabNavigationStateFromTabBarState(tabStates, shortcut.id);
  }

  render() {
    const { navigateBack } = this.props;

    const navigationState = this.getTabNavigationState()
    let screenContent = null;

    if (!isEmptyNavigationState(navigationState) && this.state.shouldRenderContent) {
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

const mapStateToProps = (state) => {
  const { tabStates } = state[ext()].tabBar;

  return {
    tabStates,
  };
};

const mapDispatchToProps = { executeShortcut, navigateBack };

export default connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('Tab'))(Tab));
