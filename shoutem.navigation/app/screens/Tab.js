import PropTypes from 'prop-types';
import React from 'react';
import {
  InteractionManager,
} from 'react-native';
import { connect } from 'react-redux';

import {
  ScreenStack,
  isEmptyNavigationState,
  navigateBack,
} from '@shoutem/core/navigation';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { NavigationBar } from '@shoutem/ui/navigation';

import { executeShortcut } from 'shoutem.application';
import { ext } from '../const';
import { getTabNavigationStack, getTabNavigationState } from '../redux';

class Tab extends React.PureComponent {
  static propTypes = {
    shortcut: PropTypes.object.isRequired,
    navigationState: PropTypes.object,
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

  render() {
    const { navigationState, navigateBack } = this.props;
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

const mapStateToProps = (state, { shortcut }) => ({
  navigationState: getTabNavigationState(state, shortcut.id),
});
const mapDispatchToProps = { executeShortcut, navigateBack };

export default connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('Tab'))(Tab));
