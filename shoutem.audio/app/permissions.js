const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [
  { type: PERMISSION_TYPES.ANDROID_FOREGROUND_SERVICE },
  { type: PERMISSION_TYPES.FOREGROUND_SERVICE_MEDIA_PLAYBACK },
];

module.exports = { permissions };
