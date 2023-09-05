const _ = require('lodash');
const { getAppConfiguration } = require('@shoutem/build-tools');
const pack = require('../package.json');
const {
  configureSettingsAndroid,
  configureSettingsIos,
} = require('./configureFacebookSdk');
const { injectFbSdk } = require('./injectFbSdk');
const { injectAppleSignInIos } = require('./injectAppleSignIn');
const { injectResolutionStrategy } = require('./injectResolutionStrategy');

const ADVERTISING_EXTENSION = 'shoutem.advertising';

const ext = resourceName =>
  resourceName ? `${pack.name}.${resourceName}` : pack.name;

const getExtensionSettings = appConfiguration => {
  const included = _.get(appConfiguration, 'included');
  const extension = _.find(
    included,
    item => item.type === 'shoutem.core.extensions' && item.id === ext(),
  );

  return _.get(extension, 'attributes.settings');
};

function preBuild(appConfiguration) {
  const extensionSettings = getExtensionSettings(appConfiguration);
  const hasAdvertisingExtension = !!appConfiguration.included.find(
    extension => extension.id === ADVERTISING_EXTENSION,
  );

  injectResolutionStrategy();
  injectFbSdk(extensionSettings, hasAdvertisingExtension);
  injectAppleSignInIos(extensionSettings);

  configureSettingsAndroid(extensionSettings);
  configureSettingsIos(extensionSettings);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
