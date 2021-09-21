const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const permissions = [
  { type: PERMISSION_TYPES.ANDROID_READ_CALENDAR, rationale: 'sycn the app events with your personal ones' },
  {
    type: PERMISSION_TYPES.ANDROID_WRITE_CALENDAR,
    rationale: 'add new events to your calendar',
  },
];

module.exports = { permissions };
