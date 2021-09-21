import React from 'react';
import PropTypes from 'prop-types';
import { useIsFocused } from '@react-navigation/native';
import { RNCamera } from 'react-native-camera';
import { connectStyle } from '@shoutem/theme';
import { View, Image } from '@shoutem/ui';
import cameraFrame from '../assets/images/focus-frame.png';
import { ext } from '../const';

/**
 * A component that lets a user scan a QR code
 */
function QRCodeScanner({ style, onQRCodeScanned }) {
  const isFocused = useIsFocused();

  if (!isFocused) {
    return null;
  }

  return (
    <View style={style.cameraContainer}>
      <RNCamera onBarCodeRead={onQRCodeScanned} style={style.cameraView} captureAudio={false} />
      <Image source={cameraFrame} style={style.cameraFocusFrame} />
    </View>
  );
}

QRCodeScanner.propTypes = {
  onQRCodeScanned: PropTypes.func,
  style: PropTypes.shape({
    cameraContainer: PropTypes.object,
    cameraFocusFrame: PropTypes.object,
    cameraView: PropTypes.object,
    noPermissionsMessage: PropTypes.object,
  }),
};

export default connectStyle(ext('QRCodeScanner'))(QRCodeScanner);
