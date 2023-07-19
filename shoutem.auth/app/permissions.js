const _ = require('lodash');
const { getAppConfiguration } = require('@shoutem/build-tools');
const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');
const package = require('./package.json');

function getExtensionSettings(appConfiguration) {
  const included = _.get(appConfiguration, 'included');
  const extension = _.find(
    included,
    item => item.type === 'shoutem.core.extensions' && item.id === package.name,
  );

  return _.get(extension, 'attributes.settings');
}

const cameraPermissionRationale = 'take your profile image';

const permissions = [
  {
    type: PERMISSION_TYPES.ANDROID_CAMERA,
    rationale: cameraPermissionRationale,
  },
  { type: PERMISSION_TYPES.IOS_CAMERA, rationale: cameraPermissionRationale },
  {
    type: PERMISSION_TYPES.IOS_PHOTO_LIBRARY,
    rationale: 'select profile image from gallery',
  },
];

const appConfiguration = getAppConfiguration();
const extensionSettings = getExtensionSettings(appConfiguration);
const trackFbsdkEvents = _.get(extensionSettings, 'trackFbsdkEvents');

if (trackFbsdkEvents) {
  permissions.push({
    type: PERMISSION_TYPES.IOS_APP_TRACKING_TRANSPARENCY,
    rationale:
      'to provide diagnostics to the app developer for app improvement',
  });
}

module.exports = { permissions };
