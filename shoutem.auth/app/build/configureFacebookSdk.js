const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const plist = require('plist');
const { projectPath } = require('@shoutem/build-tools');

function parsePlist(plistPath) {
  let plistResult = {};

  if (fs.existsSync(plistPath)) {
    const plistContent = fs.readFileSync(plistPath, 'utf8');

    try {
      plistResult = plist.parse(plistContent);
    } catch (e) {
      console.error('Unable to parse plist', plistPath);
    }
  }

  return plistResult;
}

function getFileContents(filePath) {
  let fileContents = '';

  if (fs.existsSync(filePath)) {
    try {
      fileContents = fs.readFileSync(filePath, { encoding: 'utf8' });
    } catch (err) {
      console.log(`${filePath} not found or unreadable!`);
      throw new Error(err);
    }
  }

  return fileContents;
}

/**
 * Resolves ios project settings to be configured for facebook authentication
 * If facebook authentication is enabled, writes the required keys to the Info.plist file
 */
const configureFacebookSettingsIos = (facebookSettings) => {
  console.log('Configuring Facebook login settings for iOS');

  const plistPath = 'ios/Info.plist';
  const currentPlistContents = parsePlist(plistPath);

  const appId = _.get(facebookSettings, 'appId');
  const appName = _.get(facebookSettings, 'appName');

  const facebookPlistData = {
    CFBundleURLTypes: [{
      CFBundleURLSchemes: [`fb${appId}`],
    }],
    FacebookAppID: appId,
    FacebookDisplayName: appName,
    FacebookAutoLogAppEventsEnabled: false,
    LSApplicationQueriesSchemes: [
      'fbapi',
      'fb-messenger-api',
      'fbauth2',
      'fbshareextension',
    ],
  };

  const authInfoPlist = Object.assign(currentPlistContents, facebookPlistData);

  fs.writeFileSync(plistPath, plist.build(authInfoPlist));
};

const getExistingFacebookAppId = (fileContents) => {
  const fbAppIdRegex = /<string name="facebook_app_id">([^<]*)<\/string>/;
  const result = fileContents.match(fbAppIdRegex);

  return result && result[1];
};

const configureFacebookSettingsAndroid = (facebookSettings) => {
  console.log('Configuring Facebook login settings for Android');

  const stringsXmlFilePath = path.resolve(projectPath, 'android/app/src/main/res/values/strings.xml');
  const stringsXmlContents = getFileContents(stringsXmlFilePath);

  const facebookAppId = _.get(facebookSettings, 'appId');
  const isFacebookAuthEnabled = _.get(facebookSettings, 'enabled', false);
  const existingFacebookAppId = getExistingFacebookAppId(stringsXmlContents);
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

  const updatedFileContents = stringsXmlContents.replace(searchString, replaceString);

  fs.writeFileSync(stringsXmlFilePath, updatedFileContents);
};

const configureSettingsAndroid = (extensionSettings) => {
  const facebookSettings = _.get(extensionSettings, 'providers.facebook');

  configureFacebookSettingsAndroid(facebookSettings);
};

const configureSettingsIos = (extensionSettings) => {
  const facebookSettings = _.get(extensionSettings, 'providers.facebook');
  const isFacebookAuthEnabled = _.get(facebookSettings, 'enabled', false);

  if (!isFacebookAuthEnabled) {
    return;
  }

  configureFacebookSettingsIos(facebookSettings);
};

module.exports = {
  configureSettingsAndroid,
  configureSettingsIos,
};
