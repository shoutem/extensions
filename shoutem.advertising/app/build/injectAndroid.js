const _ = require('lodash');
const {
  projectPath,
  getAndroidManifestPath,
  inject,
  ANCHORS,
} = require('@shoutem/build-tools');
const { ext, DEFAULT_ADMOB_APPS } = require('./const');

const getExtension = (appConfiguration, extensionName) => {
  const includedResources = _.get(appConfiguration, 'included');
  const extension = _.find(includedResources, {
    type: 'shoutem.core.extensions',
    id: extensionName,
  });

  return extension;
};

const getExtensionSettings = (appConfiguration, extensionName) => {
  const extension = getExtension(appConfiguration, extensionName);

  return _.get(extension, 'attributes.settings');
};

const manifestPath = getAndroidManifestPath({ cwd: projectPath });

function injectAndroid(appConfiguration) {
  const extSettings = getExtensionSettings(appConfiguration, ext());
  const AndroidAdAppId = _.get(
    extSettings,
    'AndroidAdAppId',
    DEFAULT_ADMOB_APPS.ANDROID,
  );

  const manifestString = `
  <meta-data
    android:name="com.google.android.gms.ads.APPLICATION_ID"
    android:value="${AndroidAdAppId}"/>`;

  inject(manifestPath, ANCHORS.ANDROID.MANIFEST.APPLICATION, manifestString);
}

module.exports = {
  injectAndroid,
};
