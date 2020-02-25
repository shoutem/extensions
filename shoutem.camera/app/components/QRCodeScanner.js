import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { Linking, Platform } from 'react-native';
import { RNCamera } from 'react-native-camera';
import _ from 'lodash';

import { I18n } from 'shoutem.i18n';

import { connectStyle } from '@shoutem/theme';
import { View, Image } from '@shoutem/ui';

import { ext } from '../const';

const openAppSettings = () => {
  Linking.openURL('app-settings:');
};

const { func, object, shape } = PropTypes;

/**
 * A component that lets a user scan a QR code
 */
class QRCodeScanner extends PureComponent {
  static propTypes = {
    // Called when a QR code has been successfully scanned
    onQRCodeScanned: func,
    // Component style,
    style: shape({
      cameraContainer: object,
      cameraFocusFrame: object,
      cameraView: object,
      noPermissionsMessage: object,
    }),
  }

  constructor(props) {
    super(props);

    this.onQRCodeScanned = this.onQRCodeScanned.bind(this);
  }

  onQRCodeScanned(data) {
    const { onQRCodeScanned } = this.props;

    if (!_.isFunction(onQRCodeScanned)) {
      return null;
    }

    return onQRCodeScanned(data);
  }

  render() {
    const { style } = this.props;

    return (
      <View style={style.cameraContainer}>
        <RNCamera
          onBarCodeRead={this.onQRCodeScanned}
          style={style.cameraView}
        />
        <Image
          source={require('../assets/images/focus-frame.png')}
          style={style.cameraFocusFrame}
        />
      </View>
    );
  }
}

export default connectStyle(ext('QRCodeScanner'))(QRCodeScanner);
