const _ = require('lodash');
const { getAppConfiguration } = require('@shoutem/build-tools');
const {
  PERMISSION_TYPES,
} = require('../../shoutem.permissions/app/build/const');
const package = require('./package.json');

function requiresTrackingPermission(appConfiguration) {
  const included = _.get(appConfiguration, 'included');

  // Find all web view shortcuts and combine their settings
  const shortcuts = _.filter(
    included,
    item =>
      item.type === 'shoutem.core.shortcuts' &&
      _.startsWith(item.attributes.canonicalName, package.name),
  );

  const shortcutSettings = _.map(
    shortcuts,
    shortcut => shortcut.attributes.settings?.requireCookiesPermission,
  );

  return _.reduce(
    shortcutSettings,
    (result, current) => result || !!current,
    false,
  );
}

const appConfiguration = getAppConfiguration();
const requiresTracking = requiresTrackingPermission(appConfiguration);

const permissions = [];

if (requiresTracking) {
  permissions.push({
    type: PERMISSION_TYPES.IOS_APP_TRACKING_TRANSPARENCY,
    rationale: 'improve browsing experience',
  });
}

module.exports = { permissions };
