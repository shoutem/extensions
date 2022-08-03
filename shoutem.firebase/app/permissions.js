const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const exactAlarmPermissionRationale = 'schedule local notifications';

const permissions = [
  {
    type: PERMISSION_TYPES.ANDROID_EXACT_ALARM,
    rationale: exactAlarmPermissionRationale,
  },
];

module.exports = { permissions };
