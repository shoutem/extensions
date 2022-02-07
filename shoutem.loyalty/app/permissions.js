const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const cameraPermissionRationale = 'scan loyalty QR codes';

const permissions = [
  {
    type: PERMISSION_TYPES.ANDROID_CAMERA,
    rationale: cameraPermissionRationale,
  },
  { type: PERMISSION_TYPES.IOS_CAMERA, rationale: cameraPermissionRationale },
];

module.exports = { permissions };
