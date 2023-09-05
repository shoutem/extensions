const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');

const locationRationale = 'display location relevant CMS content';

const permissions = [
  {
    type: PERMISSION_TYPES.IOS_LOCATION_WHEN_IN_USE,
    rationale: locationRationale,
  },
  {
    type: PERMISSION_TYPES.IOS_LOCATION_ALWAYS,
    rationale: locationRationale,
  },
  {
    type: PERMISSION_TYPES.IOS_LOCATION_ALWAYS_AND_WHEN_IN_USE,
    rationale: locationRationale,
  },
  {
    type: PERMISSION_TYPES.ANDROID_ACCESS_FINE_LOCATION,
    rationale: locationRationale,
  },
];

module.exports = { permissions };
