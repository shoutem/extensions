const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [
  { type: PERMISSION_TYPES.ANDROID_INTERNET },
  { type: PERMISSION_TYPES.ANDROID_BLUETOOTH },
];

module.exports = { permissions };
