import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import autoBindReact from 'auto-bind/react';
import { RNCamera } from 'react-native-camera';
import { connectStyle } from '@shoutem/theme';
import { View, Image } from '@shoutem/ui';
import { ext } from '../const';

/**
 * A component that lets a user scan a QR code
 */
class QRCodeScanner extends PureComponent {
  static propTypes = {
    onQRCodeScanned: PropTypes.func,
    style: PropTypes.shape({
      cameraContainer: PropTypes.object,
      cameraFocusFrame: PropTypes.object,
      cameraView: PropTypes.object,
      noPermissionsMessage: PropTypes.object,
    }),
  };

  constructor(props) {
    super(props);

    autoBindReact(this);
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
