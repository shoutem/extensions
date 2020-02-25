import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import WebView from 'react-native-webview'
import { connect } from 'react-redux';

import { I18n } from 'shoutem.i18n';

import {
  jumpToIndex,
  NavigationBar,
  closeModal,
} from 'shoutem.navigation';

import { connectStyle } from '@shoutem/theme';
import {
  Button,
  Icon,
  Screen,
  Spinner,
  Text,
  View,
} from '@shoutem/ui';

import { checkoutCompleted } from '../../redux/actionCreators';
import { ext } from '../../const';

const { func, string } = PropTypes;

class WebCheckoutScreen extends PureComponent {
  static propTypes = {
    // Web checkout URL generated via Storefront API
    checkoutUrl: string,
    // Redux action - empties cart in redux store
    checkoutCompleted: func,
  }

  constructor(props) {
    super(props);

    this.completeTransaction = this.completeTransaction.bind(this);
    this.getWebViewProps = this.getWebViewProps.bind(this);
    this.handleNavigationStateChange = this.handleNavigationStateChange.bind(this);
    this.updateCheckoutStatus = this.updateCheckoutStatus.bind(this);
    this.renderDoneButton = this.renderDoneButton.bind(this);
    this.renderCloseButton = this.renderCloseButton.bind(this);
    this.returnToCart = this.returnToCart.bind(this);
    this.getNavBarProps = this.getNavBarProps.bind(this);

    this.state = {
      transactionCompleted: false,
    }
  }

  renderLoadingSpinner() {
    return (
      <View styleName="vertical v-center h-center fill-parent">
        <Spinner />
      </View>
    );
  }

  returnToCart() {
    const { closeModal } = this.props;

    closeModal();
  }

  renderCloseButton() {
    return (
      <Button onPress={this.returnToCart}>
        <Icon name="close" />
      </Button>
    );
  }

  completeTransaction() {
    const { checkoutCompleted } = this.props;

    checkoutCompleted();
    this.returnToCart();
  }

  renderDoneButton() {
    return (
      <Button onPress={this.completeTransaction}>
        <Text>Done</Text>
      </Button>
    );
  }

  getNavBarProps() {
    const { transactionCompleted } = this.state;

    return {
      renderLeftComponent: transactionCompleted ?
        () => null : this.renderCloseButton,
      renderRightComponent: transactionCompleted ?
        this.renderDoneButton : () => null,
      title: I18n.t(ext('checkoutNavBarTitle')),
    }
  }

  getWebViewProps() {
    const { checkoutUrl } = this.props;

    return {
      renderLoading: this.renderLoadingSpinner,
      source: { uri: checkoutUrl },
      startInLoadingState: true,
    }
  }

  handleNavigationStateChange({ url }) {
    return this.updateCheckoutStatus(url);
  }

  updateCheckoutStatus(currentUrl) {
    // The thank_you URL is standard practice and
    // doesn't change with localization so it can
    // be safely used.
    if (currentUrl.endsWith('thank_you')) {
      this.setState({ transactionCompleted: true });
    }
  }

  render() {
    const { checkoutUrl } = this.props;

    return (
      <Screen>
        <NavigationBar {...this.getNavBarProps()} />
        <WebView
          {...this.getWebViewProps()}
          onNavigationStateChange={this.handleNavigationStateChange}
        />
      </Screen>
    );
  }
}

export default connect(null, { checkoutCompleted, closeModal })(
  connectStyle(ext('WebCheckoutScreen'))(WebCheckoutScreen)
);
