const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const cameraPermissionRationale =
  'take pictures and send them via chat';

const permissions = [
  {
    type: PERMISSION_TYPES.ANDROID_CAMERA,
    rationale: cameraPermissionRationale,
  },
  { type: PERMISSION_TYPES.IOS_CAMERA, rationale: cameraPermissionRationale },
  {
    type: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
    rationale:
      'send images via chat',
  }
];

module.exports = { permissions };
