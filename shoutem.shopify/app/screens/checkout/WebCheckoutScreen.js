import React, { PureComponent } from 'react';
import DeviceInfo from 'react-native-device-info';
import WebView from 'react-native-webview';
import { connect } from 'react-redux';
import autoBindReact from 'auto-bind/react';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Screen, Spinner, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import {
  closeModal,
  getRouteParams,
  HeaderCloseButton,
  HeaderTextButton,
} from 'shoutem.navigation';
import { ext } from '../../const';
import { checkoutCompleted } from '../../redux/actionCreators';

class WebCheckoutScreen extends PureComponent {
  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      shouldStopLoading: false,
      transactionCompleted: false,
      userAgent: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());

    DeviceInfo.getUserAgent()
      .then(userAgent => {
        this.setState({ userAgent });
      })
      .catch(error => {
        // no other action taken, as `null` user agent will result with default behavior which is
        // not an issue
        console.error('Failed to get user agent from device info.\n', error);
      });
  }

  componentDidUpdate() {
    const { navigation } = this.props;

    navigation.setOptions(this.getNavBarProps());
  }

  stopLoading() {
    this.setState({ shouldStopLoading: true });
  }

  renderLoadingSpinner() {
    const { shouldStopLoading } = this.state;

    if (shouldStopLoading) {
      return null;
    }

    return (
      <View styleName="vertical v-center h-center fill-parent">
        <Spinner />
      </View>
    );
  }

  completeTransaction() {
    const { checkoutCompleted } = this.props;

    checkoutCompleted();
    closeModal();
  }

  getNavBarProps() {
    const { transactionCompleted } = this.state;

    return {
      headerLeft: transactionCompleted
        ? () => null
        : props => (
            <HeaderCloseButton onPress={() => closeModal()} {...props} />
          ),
      headerRight: !transactionCompleted
        ? () => null
        : props => (
          <HeaderTextButton
              title={I18n.t(ext('doneButton'))}
              onPress={this.completeTransaction}
              {...props}
            />
          ),

      title: I18n.t(ext('checkoutNavBarTitle')),
    };
  }

  getWebViewProps() {
    const { checkoutUrl } = getRouteParams(this.props);
    const { userAgent } = this.state;

    return {
      userAgent,
      renderLoading: this.renderLoadingSpinner,
      onLoadEnd: () => this.stopLoading(),
      source: { uri: checkoutUrl },
      startInLoadingState: true,
    };
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
    const { checkoutUrl } = getRouteParams(this.props);

    return (
      <Screen>
        <WebView
          {...this.getWebViewProps()}
          onNavigationStateChange={this.handleNavigationStateChange}
        />
      </Screen>
    );
  }
}

WebCheckoutScreen.propTypes = {
  checkoutCompleted: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired,
};

export default connect(null, { checkoutCompleted })(
  connectStyle(ext('WebCheckoutScreen'))(WebCheckoutScreen),
);
