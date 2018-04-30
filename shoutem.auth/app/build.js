const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const plist = require('plist');
const { projectPath } = require('@shoutem/build-tools');
const pack = require('./package.json');

const ext = (resourceName) => (resourceName ? `${pack.name}.${resourceName}` : pack.name);

const getExtensionSettings = (appConfiguration) => {
  const included = _.get(appConfiguration, 'included');
  const extension = _.find(included,
    item => item.type === 'shoutem.core.extensions' && item.id === ext()
  );

  return _.get(extension, 'attributes.settings');
};

const defaultSettings = {
  NSPhotoLibraryUsageDescription: 'App needs access to your image library so you can upload photos',
};

/**
 * Resolves ios project settings to be configured for facebook authentication
 * If authentication is enabled, returns with required keys. Otherwise it's set
 * to empty.
 * @param {*} facebookSettings
 */
const configureFacebookSettingsIos = (facebookSettings) => {
  console.log('Configuring Facebook login settings for iOS');

  const isFacebookAuthEnabled = _.get(facebookSettings, 'enabled', false);
  const appId = _.get(facebookSettings, 'appId');
  const appName = _.get(facebookSettings, 'appName');

  const authInfoPlist = isFacebookAuthEnabled ? {
    CFBundleURLTypes: [{
      CFBundleURLSchemes: [`fb${appId}`],
    }],
    FacebookAppID: appId,
    FacebookDisplayName: appName,
  } : {};

  return authInfoPlist;
};

const getExistingFacebookAppId = (fileContents) => {
  const fbAppIdRegex = /<string name="facebook_app_id">([^<]*)<\/string>/;
  const result = fileContents.match(fbAppIdRegex);

  return result && result[1];
};

const configureFacebookSettingsAndroid = (facebookSettings) => {
  console.log('Configuring Facebook login settings for Android');

  const filePath = path.resolve(projectPath, 'android/app/src/main/res/values/strings.xml');
  let fileContents = '';

  try {
    fileContents = fs.readFileSync(filePath, { encoding: 'utf8' });
  } catch (err) {
    console.log(`${filePath} not found or unreadable!`);
    throw new Error(err);
  }

  const facebookAppId = _.get(facebookSettings, 'appId');
  const isFacebookAuthEnabled = _.get(facebookSettings, 'enabled', false);
  const existingFacebookAppId = getExistingFacebookAppId(fileContents);
  const facebookAppIdDiffers = (facebookAppId !== existingFacebookAppId);

  // fbauth is enabled, appId string is present and matches the current appId: no changes needed
  if (isFacebookAuthEnabled && !facebookAppIdDiffers) {
    return;
  }

  const facebookAppIdString = `<string name="facebook_app_id">${facebookAppId}</string>`;
  const existingFacebookAppIdString = `<string name="facebook_app_id">${existingFacebookAppId}</string>`;

  let searchString = '';
  let replaceString = '';

  // fbauth is enabled, but appIds differ: replace the old appId with the new one
  if (isFacebookAuthEnabled && facebookAppIdDiffers) {
    searchString = existingFacebookAppIdString;
    replaceString = facebookAppIdString;
  }
  // fbauth is enabled, but appId is not present: add the appId string
  else if (isFacebookAuthEnabled && !existingFacebookAppId) {
    searchString = '</resources>';
    replaceString = `${facebookAppIdString}\n</resources>`;
  }
  // fbauth is disabled && appId string is not present: add dummy appId
  else if (!isFacebookAuthEnabled && !existingFacebookAppId) {
    searchString = '</resources>';
    replaceString = '<string name="facebook_app_id">112233</string>';
  }

  fileContents = fileContents.replace(searchString, replaceString);
  fs.writeFileSync(filePath, fileContents);
};

const configureSettingsAndroid = (extensionSettings) => {
  const facebookSettings = _.get(extensionSettings, 'providers.facebook');
  configureFacebookSettingsAndroid(facebookSettings);
};

const configureSettingsIos = (extensionSettings) => {
  const facebookSettings = _.get(extensionSettings, 'providers.facebook');

  const authInfoPlist = Object.assign({},
    defaultSettings,
    configureFacebookSettingsIos(facebookSettings)
  );

  fs.writeFileSync('ios/Info.plist', plist.build(authInfoPlist));
};

exports.preBuild = function preBuild(appConfiguration) {
  const extensionSettings = getExtensionSettings(appConfiguration);

  configureSettingsAndroid(extensionSettings);
  configureSettingsIos(extensionSettings);
};
