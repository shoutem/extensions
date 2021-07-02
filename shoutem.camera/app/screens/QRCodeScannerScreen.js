import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Alert, Linking, AppState } from 'react-native';
import { NavigationBar } from 'shoutem.navigation';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import QRCodeScanner from '../components/QRCodeScanner.js';
import { ext } from '../const';
import autoBindReact from 'auto-bind/react';

/**
 * A screen that lets a user scan a QR code
 */
class QRCodeScannerScreen extends PureComponent {
  static propTypes = {
    onQRCodeScanned: PropTypes.func,
    title: PropTypes.string,
  };

  constructor(props) {
    super(props);

    autoBindReact(this);

    this.state = {
      appState: AppState.currentState,
      codeScanned: false,
    };
  }

  componentDidMount() {
    // App state listener is needed because react-native-camera performs
    // code scans every 500ms. This means that in the split second while
    // opening the link that was already scanned, it is possible that
    // another scan will be captured.
    // That's why we need to cleanup the state upon returning to the app.
    AppState.addEventListener('change', this.handleAppStateChange);
  }

  handleAppStateChange(nextAppState) {
    const { appState } = this.state;

    if (appState.match(/inactive|background/) && nextAppState === 'active') {
      this.setState({ codeScanned: false });
    }

    this.setState({ appState: nextAppState });
  }

  async showQRCodePrompt({ data: url }) {
    const { codeScanned } = this.state;
    if (codeScanned) {
      return;
    }

    this.setState({ codeScanned: true });

    const canOpenURL = await Linking.canOpenURL(url);

    const alertTitle = I18n.t(ext('codeScannedTitle'));
    const alertMessage = canOpenURL
      ? I18n.t(ext('codeScannedMessage'), { url })
      : I18n.t(ext('codeMissingUrlMessage'));

    const alertCancelButton = {
      text: I18n.t(ext('cancelButtonLabel')),
      onPress: () => this.setState({ codeScanned: false }),
    };

    const alertConfirmButton = {
      text: I18n.t(ext('openButtonLabel')),
      onPress: () => {
        Linking.openURL(url);
        _.debounce(() => this.setState({ codeScanned: false }), 1500);
      },
    };

    const alertOptions = canOpenURL
      ? [alertCancelButton, alertConfirmButton]
      : [alertConfirmButton];

    Alert.alert(alertTitle, alertMessage, alertOptions);
  }

  handleQRCodeScan(code) {
    const { onQRCodeScanned } = this.props;
    const { codeScanned } = this.state;

    if (onQRCodeScanned && !codeScanned) {
      this.setState({ codeScanned: true });
      onQRCodeScanned(code);
      return;
    }

    this.showQRCodePrompt(code);
  }

  render() {
    const { title } = this.props;

    return (
      <Screen>
        <NavigationBar title={title.toUpperCase()} />
        <QRCodeScanner onQRCodeScanned={this.handleQRCodeScan} />
      </Screen>
    );
  }
}

export default connectStyle(ext('QRCodeScannerScreen'))(QRCodeScannerScreen);
