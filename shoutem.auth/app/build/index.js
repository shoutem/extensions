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
const { embedFbsdkFrameworks } = require('./embedFbsdkFrameworks');

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
  injectResolutionStrategy();
  injectFbSdk(extensionSettings);
  injectAppleSignInIos(extensionSettings);

  configureSettingsAndroid(extensionSettings);
  configureSettingsIos(extensionSettings);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

function postConfigure(appConfiguration) {
  const extensionSettings = getExtensionSettings(appConfiguration);
  const facebookAuthEnabled = extensionSettings?.providers?.facebook?.enabled;
  const trackFbsdkEvents = extensionSettings?.trackFbsdkEvents;

  if (facebookAuthEnabled || trackFbsdkEvents) {
    embedFbsdkFrameworks();
  }
}

function runPostConfigure() {
  const appConfiguration = getAppConfiguration();
  postConfigure(appConfiguration);
}

module.exports = {
  postConfigure,
  preBuild,
  runPostConfigure,
  runPreBuild,
};
