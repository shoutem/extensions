const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [
  {
    type: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
    rationale: 'allow screenshots of preview app',
  },
];

module.exports = { permissions };
