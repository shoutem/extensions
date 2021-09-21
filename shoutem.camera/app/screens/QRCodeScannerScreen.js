import React, { useState } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Alert, Linking } from 'react-native';
import { connectStyle } from '@shoutem/theme';
import { Screen } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { getRouteParams } from 'shoutem.navigation';
import { ext } from '../const';
import QRCodeScanner from '../components/QRCodeScanner.js';

/**
 * A screen that lets a user scan a QR code
 */
function QRCodeScannerScreen(props) {
  const [codeScanned, setCodeScanned] = useState(false);

  async function showQRCodePrompt({ data: url }) {
    const canOpenURL = await Linking.canOpenURL(url);

    const alertTitle = I18n.t(ext('codeScannedTitle'));
    const alertMessage = canOpenURL
      ? I18n.t(ext('codeScannedMessage'), { url })
      : I18n.t(ext('codeMissingUrlMessage'));

    const alertCancelButton = {
      text: I18n.t(ext('cancelButtonLabel')),
      onPress: () => setCodeScanned(false),
    };

    const alertConfirmButton = {
      text: I18n.t(ext('openButtonLabel')),
      onPress: () => {
        setCodeScanned(false);
        Linking.openURL(url);
      },
    };

    const alertOptions = canOpenURL
      ? [alertCancelButton, alertConfirmButton]
      : [alertCancelButton];

    Alert.alert(alertTitle, alertMessage, alertOptions);
  }

  function handleQRCodeScan(code) {
    if (codeScanned) {
      return;
    }

    setCodeScanned(true);
    const { onQRCodeScanned } = getRouteParams(props);

    if (_.isFunction(onQRCodeScanned)) {
      onQRCodeScanned(code);
      return;
    }

    showQRCodePrompt(code);
  }

  const codeScanHandler = codeScanned ? null : handleQRCodeScan;
  return (
    <Screen>
      <QRCodeScanner onQRCodeScanned={codeScanHandler} />
    </Screen>
  );
}

QRCodeScannerScreen.propTypes = {
  onQRCodeScanned: PropTypes.func,
  title: PropTypes.string,
};

export default connectStyle(ext('QRCodeScannerScreen'))(QRCodeScannerScreen);
