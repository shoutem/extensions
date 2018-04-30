import PropTypes from 'prop-types';
import React, {
  PureComponent,
} from 'react';

import { connect } from 'react-redux';

import {
  ScreenStack,
  navigateBack,
  closeModal,
} from '@shoutem/core/navigation';

import { connectStyle } from '@shoutem/theme';

import {
  View,
  Screen,
  Button,
  Icon,
} from '@shoutem/ui';

import { ChildNavigationBar } from '@shoutem/ui/navigation';

import { ext } from '../const';

class Modal extends PureComponent {
  static propTypes = {
    closeModal: PropTypes.func,
    navigationState: PropTypes.object,
    style: PropTypes.object,
    navigateBack: PropTypes.func,

    // Our Modal screen automatically adds a left navigation bar
    // component that fires closeModal action. Setting this props allows
    // us to override this, and use the navBar components defined within the 
    // screen/component that is being opened within our Modal screen
    customNavigationBar: PropTypes.bool,
  };

  constructor(props, context) {
    super(props, context);
    this.closeModal = this.closeModal.bind(this);
  }

  closeModal() {
    this.props.closeModal();
  }

  getNavbarProps() {
    const { navigationState, customNavigationBar } = this.props;

    if (navigationState.index > 0 || customNavigationBar) {
      return { renderLeftComponent: undefined };
    }

    return {
      renderLeftComponent: () => (
        <View virtual styleName="container">
          <Button onPress={this.closeModal}>
            <Icon name="close" />
          </Button>
        </View>
      ),
    };
  }

  render() {
    const { navigationState } = this.props;

    return (
      <Screen>
        <ChildNavigationBar {...this.getNavbarProps()} />
        <ScreenStack
          navigationState={navigationState}
          onNavigateBack={this.props.navigateBack}
        />
      </Screen>
    );
  }
}

const mapStateToProps = state => ({ navigationState: state[ext()].modal.navigation });
const mapDispatchToProps = { closeModal, navigateBack };

export default connect(mapStateToProps, mapDispatchToProps)(connectStyle(ext('Modal'))(Modal));
