const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const cameraPermissionRationale = 'take your profile image';

const permissions = [
  {
    type: PERMISSION_TYPES.ANDROID_CAMERA,
    rationale: cameraPermissionRationale,
  },
  { type: PERMISSION_TYPES.IOS_CAMERA, rationale: cameraPermissionRationale },
  {
    type: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
    rationale: 'select profile image from gallery',
  },
];

module.exports = { permissions };
