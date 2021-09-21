const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const cameraPermissionRationale = 'take pictures and post them to social wall';

const permissions = [
  {
    type: PERMISSION_TYPES.ANDROID_CAMERA,
    rationale: cameraPermissionRationale,
  },
  { type: PERMISSION_TYPES.IOS_CAMERA, rationale: cameraPermissionRationale },
  {
    type: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
    rationale: 'select images to include in your social posts',
  },
];

module.exports = { permissions };
