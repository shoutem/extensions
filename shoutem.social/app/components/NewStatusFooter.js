import React from 'react';
import {
  Alert,
  Keyboard as RNKeyboard,
  KeyboardAvoidingView,
  Linking,
  Platform,
} from 'react-native';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import PropTypes from 'prop-types';
import { connectStyle } from '@shoutem/theme';
import { Icon, Keyboard, TouchableOpacity, View } from '@shoutem/ui';
import { I18n } from 'shoutem.i18n';
import { requestPermissions, RESULTS } from 'shoutem.permissions';
import {
  CAMERA_PERMISSION,
  ext,
  GALLERY_PERMISSION,
  IMAGE_PICKER_OPTIONS,
} from '../const';

function noPermissionsAlert(message) {
  return Alert.alert(I18n.t(ext('noPermissionsAlertTitle')), message, [
    {
      text: I18n.t(ext('cancelButtonLabel')),
      style: 'cancel',
    },
    {
      text: I18n.t(ext('openSettingsButtonLabel')),
      onPress: () => Linking.openURL('app-settings:'),
    },
    { cancelable: true },
  ]);
}

function NewStatusFooter({ enablePhotoAttachments, onImageSelected, style }) {
  const keyboardOffset = Keyboard.calculateKeyboardOffset();

  function handleCameraSelectPress() {
    RNKeyboard.dismiss();

    requestPermissions(CAMERA_PERMISSION).then(result => {
      if (result[CAMERA_PERMISSION] === RESULTS.GRANTED) {
        return launchCamera(IMAGE_PICKER_OPTIONS, onImageSelected);
      }

      if (Platform.OS === 'ios') {
        return noPermissionsAlert(I18n.t(ext('noCameraPermissionsAlertText')));
      }

      return null;
    });
  }

  function handleGallerySelectPress() {
    RNKeyboard.dismiss();

    requestPermissions(GALLERY_PERMISSION).then(result => {
      if (result[GALLERY_PERMISSION] === RESULTS.GRANTED) {
        return launchImageLibrary(IMAGE_PICKER_OPTIONS, onImageSelected);
      }

      if (Platform.OS === 'ios') {
        return noPermissionsAlert(I18n.t(ext('noMediaPermissionsAlertText')));
      }

      return null;
    });
  }

  return (
    <KeyboardAvoidingView
      behavior="padding"
      keyboardVerticalOffset={keyboardOffset}
    >
      <View style={style.container}>
        {enablePhotoAttachments && (
          <>
            <TouchableOpacity
              onPress={handleCameraSelectPress}
              style={[style.button, style.buttonMargin]}
            >
              <Icon name="camera" style={style.attachmentIcon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleGallerySelectPress}
              style={style.button}
            >
              <Icon name="gallery" style={style.attachmentIcon} />
            </TouchableOpacity>
          </>
        )}
      </View>
    </KeyboardAvoidingView>
  );
}

NewStatusFooter.propTypes = {
  enablePhotoAttachments: PropTypes.bool.isRequired,
  onImageSelected: PropTypes.func.isRequired,
  style: PropTypes.object,
};

NewStatusFooter.defaultProps = {
  style: {},
};

export default connectStyle(ext('NewStatusFooter'))(NewStatusFooter);
