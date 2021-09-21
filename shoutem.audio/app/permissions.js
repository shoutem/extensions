const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [{ type: PERMISSION_TYPES.ANDROID_FOREGROUND_SERVICE }];

module.exports = { permissions };
