import React, { useEffect } from 'react';
import { Alert, Platform } from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { useIsFocused } from '@react-navigation/native';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Image, View } from '@shoutem/ui';
import { useIsForeground } from 'shoutem.application';
import { I18n } from 'shoutem.i18n';
import {
  openSettings,
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import cameraFrame from '../assets/images/focus-frame.png';
import { ext } from '../const';

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

/**
 * A component that lets a user scan a QR code
 */
function QRCodeScanner({ style, onQRCodeScanned }) {
  useEffect(() => {
    requestPermissions(CAMERA_PERMISSION).then(result => {
      if (result[CAMERA_PERMISSION] !== RESULTS.GRANTED) {
        Alert.alert(
          I18n.t(ext('missingPermissionAlertTitle')),
          I18n.t(ext('permissionNotGranted')),
          [
            {
              text: I18n.t(ext('cancelButtonLabel')),
              style: 'cancel',
            },
            {
              text: I18n.t(ext('openSettingsButtonLabel')),
              onPress: openSettings,
            },
            { cancelable: true },
          ],
        );
      }
    });
  }, []);

  const { hasPermission } = useCameraPermission();

  const isFocused = useIsFocused();
  const isForeground = useIsForeground();
  const isActive = isFocused && isForeground;

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    // QR and barcode.
    codeTypes: ['qr', 'ean-13'],
    // Note that you should encode your QR payload into utf8, if there's
    // any possibility for special characters inside payload. Camera will
    // return already decoded result inside onCodeScanned result.
    onCodeScanned: onQRCodeScanned,
  });

  if (!isFocused || !hasPermission) {
    return null;
  }

  return (
    <View style={style.cameraContainer}>
      {device != null && (
        <Camera
          device={device}
          isActive={isActive}
          codeScanner={codeScanner}
          enableZoomGesture
          style={style.cameraView}
        />
      )}
      <Image source={cameraFrame} style={style.cameraFocusFrame} />
    </View>
  );
}

QRCodeScanner.propTypes = {
  style: PropTypes.object.isRequired,
  onQRCodeScanned: PropTypes.func.isRequired,
};

export default connectStyle(ext('QRCodeScanner'))(QRCodeScanner);
