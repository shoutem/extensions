import ImagePicker from 'react-native-image-crop-picker';
import _ from 'lodash';

const IMAGE_TYPE = 'image/png';
const IMAGE_UPLOAD_OPTIONS = {
  multiple: true,
  mediaType: 'photo',
  includeBase64: false,
  compressImageMaxWidth: 500,
  compressImageMaxHeight: 500,
  compressImageQuality: 0.8,
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
    const response = await ImagePicker.openCamera({
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

async function openPicker(options) {
  try {
    const resolvedOptions = {
      ...IMAGE_UPLOAD_OPTIONS,
      ...options,
    };
    const response = await ImagePicker.openPicker(resolvedOptions);
    // multiple:true is default option and response returns array of images data
    // For cases when we have multiple:false, response returns only object of image data
    // We want to wrap it in array because resolveUpload() expects array
    const resolvedResponse = !resolvedOptions.multiple ? [response] : response;

    return resolveUpload(resolvedResponse);
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

function formatImageUpload(imageFile) {
  const { path, filename } = imageFile;
  const fileName = filename || path.split('/').pop();

  const image = {
    uri: path,
    name: `${Date.now()}-${fileName}`,
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

export default { openCamera, openPicker, ERRORS };
