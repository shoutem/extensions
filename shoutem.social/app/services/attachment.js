import { Alert, Keyboard as RNKeyboard, Linking, Platform } from 'react-native';
import {
  openCamera as launchCamera,
  openPicker as launchImageLibrary,
} from 'react-native-image-crop-picker';
import { I18n } from 'shoutem.i18n';
import {
  PERMISSION_TYPES,
  requestPermissions,
  RESULTS,
} from 'shoutem.permissions';
import { ext } from '../const';

export const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

export const GALLERY_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
  default: PERMISSION_TYPES.ANDROID_READ_EXTERNAL_STORAGE,
});

export const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

export const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  compressImageMaxWidth: 1024,
  compressImageMaxHeight: 1024,
  compressImageQuality: 0.8, // 0-1
};

export const CAMERAROLL_OPTIONS = {
  first: 5,
  assetType: 'Photos',
  include: ['filename', 'fileSize'],
};

export function hasGalleryPermissions() {
  return requestPermissions(GALLERY_PERMISSION).then(
    result => result[GALLERY_PERMISSION] === RESULTS.GRANTED,
  );
}

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

export function openCamera(onImageSelected) {
  RNKeyboard.dismiss();

  requestPermissions(CAMERA_PERMISSION).then(result => {
    if (
      Platform.OS === 'ios' &&
      result[CAMERA_PERMISSION] !== RESULTS.GRANTED
    ) {
      return noPermissionsAlert(I18n.t(ext('noCameraPermissionsAlertText')));
    }

    if (result[CAMERA_PERMISSION] === RESULTS.GRANTED) {
      return launchCamera(IMAGE_PICKER_OPTIONS)
        .then(image => {
          return onImageSelected(image);
        })
        .catch(error => {
          if (error.code === 'E_PICKER_CANCELLED') {
            return null;
          }

          return null;
        });
    }

    return null;
  });
}

export function openImageGallery(onImageSelected) {
  RNKeyboard.dismiss();

  requestPermissions(GALLERY_PERMISSION).then(result => {
    if (
      Platform.OS === 'ios' &&
      result[GALLERY_PERMISSION] !== RESULTS.GRANTED
    ) {
      return noPermissionsAlert(I18n.t(ext('noMediaPermissionsAlertText')));
    }

    if (result[GALLERY_PERMISSION] === RESULTS.GRANTED) {
      return launchImageLibrary(IMAGE_PICKER_OPTIONS)
        .then(image => {
          return onImageSelected(image);
        })
        .catch(error => {
          if (error.code === 'E_PICKER_CANCELLED') {
            return null;
          }

          return null;
        });
    }

    return null;
  });
}
