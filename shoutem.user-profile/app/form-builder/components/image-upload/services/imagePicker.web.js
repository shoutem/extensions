import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import _ from 'lodash';
import { unavailableInWeb } from 'shoutem.application';

const IMAGE_TYPE = 'image/png';
const IMAGE_UPLOAD_OPTIONS = {
  mediaType: 'photo',
  compressImageMaxWidth: 1024,
  compressImageMaxHeight: 1024,
  compressImageQuality: 0.8, // 0-1
};

export const CROP_UPLOAD_OPTIONS = {
  cropping: true,
  multiple: false,
};

export const CIRCULAR_CROP_OPTIONS = {
  ...CROP_UPLOAD_OPTIONS,
  cropperCircleOverlay: true,
};

export const ERRORS = {
  CAMERA_PERMISSION: 'Error: User did not grant camera permission',
  CANNOT_ACCESS: 'Error: Cannot access images',
  LIBRARY_PERMISSION: 'Error: User did not grant library permission',
  REQUIRED_PERMISSION: 'Error: Required permission missing',
};

async function openCamera(options) {
  try {
    const response = await launchCamera({
      ...IMAGE_UPLOAD_OPTIONS,
      ...options,
    });

    return resolveUpload([response]);
  } catch (error) {
    const isAccessPermissionError = _.startsWith(
      error,
      ERRORS.CAMERA_PERMISSION,
    );

    if (isAccessPermissionError) {
      throw new Error(ERRORS.CAMERA_PERMISSION);
    }

    return null;
  }
}

async function openPicker() {
  try {
    const response = await launchImageLibrary(IMAGE_UPLOAD_OPTIONS);

    return resolveUpload([response]);
  } catch (error) {
    const isAccessPermissionError = _.startsWith(error, ERRORS.CANNOT_ACCESS);
    const isLibraryPermissionError = _.startsWith(
      error,
      ERRORS.LIBRARY_PERMISSION,
    );
    const isRequiredPermissionError = _.startsWith(
      error,
      ERRORS.REQUIRED_PERMISSION,
    );

    if (isAccessPermissionError) {
      throw new Error(ERRORS.CANNOT_ACCESS);
    }

    if (isLibraryPermissionError) {
      throw new Error(ERRORS.LIBRARY_PERMISSION);
    }

    if (isRequiredPermissionError) {
      throw new Error(ERRORS.REQUIRED_PERMISSION);
    }

    return null;
  }
}

function formatImageUpload(imageUpload) {
  const image = {
    uri: imageUpload.assets[0].uri,
    name: `${Date.now()}.${IMAGE_TYPE}`,
    type: IMAGE_TYPE,
  };

  return image;
}

function resolveUpload(response) {
  return _.reduce(
    response,
    (result, image) => {
      return [...result, formatImageUpload(image)];
    },
    [],
  );
}

export default { openCamera: unavailableInWeb(openCamera), openPicker, ERRORS };
