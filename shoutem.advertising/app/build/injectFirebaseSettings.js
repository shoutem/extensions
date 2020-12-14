const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { projectPath } = require('@shoutem/build-tools');
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

function injectFirebaseSettings(appConfiguration) {
  const extSettings = getExtensionSettings(appConfiguration, ext());
  const AndroidAdAppId = _.get(extSettings, 'AndroidAdAppId', DEFAULT_ADMOB_APPS.ANDROID);
  const iOSAdAppId = _.get(extSettings, 'iOSAdAppId', DEFAULT_ADMOB_APPS.IOS);
  const filePath = path.resolve(projectPath, 'firebase.json');

  try {
    fs.ensureFileSync(filePath);
    const existingConfig = fs.readJsonSync(filePath, { throws: false });
    const config = {
      'react-native': {
        admob_android_app_id: AndroidAdAppId,
        admob_ios_app_id: iOSAdAppId,
      },
    };
    const actionTaken = _.isEmpty(existingConfig) ? 'Created' : 'Modified';
    const newConfig = existingConfig ? _.merge(existingConfig, config) : config;
    fs.writeJsonSync(filePath, newConfig);

    console.log(`[${ext()}] - ${actionTaken} root/firebase.json`);
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  injectFirebaseSettings,
};
