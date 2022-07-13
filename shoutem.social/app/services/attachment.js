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

const INVALID_TEXT_ERROR =
  'link-preview-js did not receive a valid url or text';
const INVALID_OR_NO_URL_ERROR =
  'link-preview-js did not receive a valid a url or text';

const YOUTUBE_URL_REGEX = /^((?:https?:)?\/\/)?((?:www|m)\.)?((?:youtube(-nocookie)?\.com|youtu.be))(\/(?:[\w-]+\?v=|embed\/|v\/)?)([\w-]+)(\S+)?$/i;

const MEDIA_TYPE = {
  AUDIO: 'audio',
  IMAGE: 'image',
  VIDEO: 'video',
  VIDEO_OTHER: 'video.other',
  MUSIC_SONG: 'music.song',
  WEB: 'website',
  OBJECT: 'object',
};

const CAMERA_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_CAMERA,
  default: PERMISSION_TYPES.ANDROID_CAMERA,
});

const GALLERY_PERMISSION = Platform.select({
  ios: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
  default: PERMISSION_TYPES.ANDROID_READ_EXTERNAL_STORAGE,
});

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;

const IMAGE_PICKER_OPTIONS = {
  mediaType: 'photo',
  compressImageMaxWidth: 1024,
  compressImageMaxHeight: 1024,
  compressImageQuality: 0.8, // 0-1
};

const CAMERAROLL_OPTIONS = {
  first: 5,
  assetType: 'Photos',
  include: ['filename', 'fileSize'],
};

function hasGalleryPermissions() {
  return requestPermissions(GALLERY_PERMISSION).then(
    result =>
      result[GALLERY_PERMISSION] === RESULTS.GRANTED ||
      result[GALLERY_PERMISSION] === RESULTS.LIMITED,
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

function openCamera(onImageSelected) {
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

function openImageGallery(onImageSelected) {
  RNKeyboard.dismiss();

  requestPermissions(GALLERY_PERMISSION).then(result => {
    if (
      Platform.OS === 'ios' &&
      result[GALLERY_PERMISSION] !== RESULTS.GRANTED &&
      result[GALLERY_PERMISSION] !== RESULTS.LIMITED
    ) {
      return noPermissionsAlert(I18n.t(ext('noMediaPermissionsAlertText')));
    }

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
  });
}

function getYoutubeVideoData(url) {
  // eslint-disable-next-line no-undef
  return fetch(
    `https://youtube.com/oembed?url=${url}&format=json`,
  ).then(response => response.json());
}

async function resolveYoutubeUrlMetadata(metadata) {
  const { url } = metadata;

  const youtubeMetadata = await getYoutubeVideoData(url);

  return {
    mediaType: MEDIA_TYPE.VIDEO,
    url,
    title: youtubeMetadata.title,
    image: youtubeMetadata.thumbnail_url,
  };
}

export default {
  CAMERAROLL_OPTIONS,
  hasGalleryPermissions,
  INVALID_OR_NO_URL_ERROR,
  INVALID_TEXT_ERROR,
  MAX_IMAGE_SIZE,
  MEDIA_TYPE,
  openCamera,
  openImageGallery,
  resolveYoutubeUrlMetadata,
  YOUTUBE_URL_REGEX,
};
