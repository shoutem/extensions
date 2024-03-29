const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [
  { type: PERMISSION_TYPES.IOS_NOTIFICATIONS },
  { type: PERMISSION_TYPES.ANDROID_NOTIFICATIONS },
];

module.exports = { permissions };
