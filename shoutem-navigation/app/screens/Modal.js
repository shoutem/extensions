import React, {
  PureComponent,
} from 'react';

import {
  InteractionManager,
} from 'react-native';

import { connect } from 'react-redux';

import {
  ScreenStack,
  navigateBack,
  setActiveNavigationStack,
  ROOT_NAVIGATION_STACK,
} from '@shoutem/core/navigation';

import { connectStyle } from '@shoutem/theme';

import {
  View,
  Screen,
  Button,
  Icon,
} from '@shoutem/ui';

import { NavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

import {
  MODAL_NAVIGATION_STACK,
} from '../redux';

class Modal extends PureComponent {
  static propTypes = {
    navigationState: React.PropTypes.object,
    style: React.PropTypes.object,
    setActiveNavigationStack: React.PropTypes.func,
    replaceWith: React.PropTypes.func,
    navigateBack: React.PropTypes.func,
    onModalActive: React.PropTypes.func,
    previousStack: React.PropTypes.object,
  };

  constructor(props, context) {
    super(props, context);
    this.closeModal = this.closeModal.bind(this);
    this.renderCloseButton = this.renderCloseButton.bind(this);
  }

  componentWillMount() {
    this.props.setActiveNavigationStack(MODAL_NAVIGATION_STACK);
  }

  componentDidMount() {
    const { onModalActive } = this.props;

    if (!!onModalActive) {
      InteractionManager.runAfterInteractions(onModalActive);
    }
  }

  closeModal() {
    const { setActiveNavigationStack, navigateBack, previousStack } = this.props;

    setActiveNavigationStack(previousStack);
    navigateBack(ROOT_NAVIGATION_STACK);
  }

  renderCloseButton(sceneProps) {
    const { navigationState } = this.props;
    const iconName = 'back';

    let handlePress = this.closeModal;

    if (navigationState.index > 0) {
      handlePress = sceneProps.onNavigateBack;
    }

    return (
      <View virtual styleName="container">
        <Button onPress={handlePress}>
          <Icon
            name={iconName}
          />
        </Button>
      </View>
    );
  }

  render() {
    const { navigationState, navigateBack } = this.props;

    return (
      <Screen>
        <NavigationBar
          child
          renderLeftComponent={this.renderCloseButton}
        />
        <ScreenStack
          styleName="root"
          navigationState={navigationState}
          onNavigateBack={navigateBack}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => ({ navigationState: state[ext()].modal });
const mapDispatchToProps = { navigateBack, setActiveNavigationStack };

export default connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('Modal'))(Modal));
