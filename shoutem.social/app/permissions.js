const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [
  {
    type: PERMISSION_TYPES.ANDROID_CAMERA,
    rationale: 'take pictures and post them to social wall',
  },
  {
    type: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
    rationale: 'select images to include in your social posts',
  },
  {
    type: PERMISSION_TYPES.IOS_CAMERA,
    rationale: 'take pictures and post them to social wall',
  },
  {
    type: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
    rationale: 'select images to include in your social posts',
  },
];

module.exports = { permissions };
