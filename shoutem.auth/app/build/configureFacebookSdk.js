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
      // eslint-disable-next-line no-console
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
      // eslint-disable-next-line no-console
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
function configureFacebookSettingsIos(facebookSettings) {
  // eslint-disable-next-line no-console
  console.log('Configuring Facebook login settings for iOS');

  const plistPath = 'ios/Info.plist';
  const currentPlistContents = parsePlist(plistPath);

  const appId = facebookSettings?.appId;
  const appName = facebookSettings?.appName;
  const clientToken = facebookSettings?.clientToken;
  const trackFbsdkEvents = !!facebookSettings?.clientToken;

  const facebookPlistData = {
    CFBundleURLTypes: [
      {
        CFBundleURLSchemes: [`fb${appId}`],
      },
    ],
    FacebookAppID: appId,
    FacebookClientToken: clientToken,
    FacebookDisplayName: appName,
    FacebookAutoLogAppEventsEnabled: trackFbsdkEvents,
    LSApplicationQueriesSchemes: ['fbapi', 'fb-messenger-share-api'],
  };

  const authInfoPlist = Object.assign(currentPlistContents, facebookPlistData);

  fs.writeFileSync(plistPath, plist.build(authInfoPlist));
}

function getExistingFacebookAppId(fileContents) {
  const fbAppIdRegex = /<string name="facebook_app_id">([^<]*)<\/string>/;
  const result = fileContents.match(fbAppIdRegex);

  return result && result[1];
}

function getExistingClientToken(fileContents) {
  const fbClientTokenRegex = /<string name="facebook_client_token">([^<]*)<\/string>/;
  const result = fileContents.match(fbClientTokenRegex);

  return result && result[1];
}

function updateXmlFile(xmlFile, property, newString, oldString) {
  if (!oldString || !xmlFile.includes(property)) {
    return xmlFile.replace('</resources>', `${newString}\n</resources>`);
  }

  return xmlFile.replace(oldString, newString);
}

function configureFacebookSettingsAndroid(facebookSettings = {}) {
  // eslint-disable-next-line no-console
  console.log('Configuring Facebook login settings for Android');
  const {
    appId: facebookAppId,
    clientToken,
    enabled: isFacebookAuthEnabled = false,
    trackFbsdkEvents,
  } = facebookSettings;

  const stringsXmlFilePath = path.resolve(
    projectPath,
    'android/app/src/main/res/values/strings.xml',
  );
  const stringsXmlContents = getFileContents(stringsXmlFilePath);

  const existingFacebookAppId = getExistingFacebookAppId(stringsXmlContents);
  const facebookAppIdDiffers = facebookAppId !== existingFacebookAppId;

  const existingClientToken = getExistingClientToken(stringsXmlContents);
  const clientTokenDiffers = clientToken !== existingClientToken;

  let resultingXmlFile = stringsXmlContents;

  if (isFacebookAuthEnabled || trackFbsdkEvents) {
    if (!facebookAppIdDiffers && !clientTokenDiffers) {
      return;
    }

    if (facebookAppIdDiffers) {
      const appIdString = `<string name="facebook_app_id">${facebookAppId}</string>`;
      const existingAppIdString = `<string name="facebook_app_id">${existingFacebookAppId}</string>`;

      resultingXmlFile = updateXmlFile(
        resultingXmlFile,
        'facebook_app_id',
        appIdString,
        existingAppIdString,
      );

      const protocolString = `<string name="fb_login_protocol_scheme">fb${facebookAppId}</string>`;
      const existingProtocolString = `<string name="fb_login_protocol_scheme">fb${existingFacebookAppId}</string>`;

      resultingXmlFile = updateXmlFile(
        resultingXmlFile,
        'fb_login_protocol_scheme',
        protocolString,
        existingProtocolString,
      );
    }

    if (clientTokenDiffers) {
      const clientTokenString = `<string name="facebook_client_token">${clientToken}</string>`;
      const existingClientTokenString = `<string name="facebook_client_token">${existingClientToken}</string>`;

      resultingXmlFile = updateXmlFile(
        resultingXmlFile,
        'facebook_client_token',
        clientTokenString,
        existingClientTokenString,
      );
    }
  } else {
    if (!existingFacebookAppId) {
      const dummyAppIdString = '<string name="facebook_app_id">112233</string>';
      resultingXmlFile = updateXmlFile(
        resultingXmlFile,
        'facebook_app_id',
        dummyAppIdString,
      );

      const dummyProtocolString = `<string name="fb_login_protocol_scheme">fb112233</string>`;
      resultingXmlFile = updateXmlFile(
        resultingXmlFile,
        'fb_login_protocol_scheme',
        dummyProtocolString,
      );
    }

    if (!existingClientToken) {
      const dummyString =
        '<string name="facebook_client_token">445566</string>';
      resultingXmlFile = updateXmlFile(
        resultingXmlFile,
        'facebook_client_token',
        dummyString,
      );
    }
  }

  fs.writeFileSync(stringsXmlFilePath, resultingXmlFile);
}

function configureSettingsAndroid(extensionSettings) {
  const trackFbsdkEvents = _.get(extensionSettings, 'trackFbsdkEvents');
  const facebookSettings = _.get(extensionSettings, 'providers.facebook');
  const resolvedSettings = {
    ...facebookSettings,
    trackFbsdkEvents,
  };

  configureFacebookSettingsAndroid(resolvedSettings);
}

function configureSettingsIos(extensionSettings) {
  const trackFbsdkEvents = _.get(extensionSettings, 'trackFbsdkEvents');
  const facebookSettings = _.get(extensionSettings, 'providers.facebook');
  const isFacebookAuthEnabled = _.get(facebookSettings, 'enabled', false);

  if (isFacebookAuthEnabled || trackFbsdkEvents) {
    const resolvedSettings = {
      ...facebookSettings,
      trackFbsdkEvents,
    };

    configureFacebookSettingsIos(resolvedSettings);
  }
}

module.exports = {
  configureSettingsAndroid,
  configureSettingsIos,
};
