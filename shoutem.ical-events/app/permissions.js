const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [
  { type: PERMISSION_TYPES.ANDROID_READ_CALENDAR, rationale: 'sycn the iCal type events with your personal ones' },
  {
    type: PERMISSION_TYPES.ANDROID_WRITE_CALENDAR,
    rationale: 'add new iCal type events to your calendar',
  },
];

module.exports = { permissions };
