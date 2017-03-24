const _ = require('lodash');
const fs = require('fs-extra');
const plist = require('plist');

const SHOUTEM_AUTH = 'shoutem.auth';
const infoPlistPath = '../../ios/ShoutemApp/Info.plist';
const stringsXMLPath = '../../android/app/src/main/res/values/strings.xml';

const isAuthExtension = i => i.type === 'shoutem.core.extensions' && i.id === SHOUTEM_AUTH;

const configureFacebookSettingsIOS = (facebookAppId, facebookAppName) => {
  console.log('Configuring Facebook login settings for iOS');

  const infoPlistFile = fs.readFileSync(infoPlistPath, 'utf8');
  const infoPlist = plist.parse(infoPlistFile);

  infoPlist.CFBundleURLTypes.push({ CFBundleURLSchemes: [`fb${facebookAppId}`] });
  infoPlist.FacebookAppID = facebookAppId;
  infoPlist.FacebookDisplayName = facebookAppName;

  fs.writeFileSync(infoPlistPath, plist.build(infoPlist));
};

const configureFacebookSettingsAndroid = (facebookAppId) => {
  console.log('Configuring Facebook login settings for Android');

  const stringsXML = fs.readFileSync(stringsXMLPath, 'utf8');
  const newStringsXML = stringsXML.replace(/facebook-app-id/g, facebookAppId);

  fs.writeFileSync(stringsXMLPath, newStringsXML);
};

exports.preBuild = function preBuild(appConfiguration) {
  const authExtension = _.get(appConfiguration, 'included').find(isAuthExtension);
  const facebookSettings = _.get(authExtension, 'attributes.settings.providers.facebook') || {};

  const { appId: facebookAppId, appName: facebookAppName } = facebookSettings;

  if (!(facebookAppId && facebookAppName)) {
    return;
  }

  configureFacebookSettingsIOS(facebookAppId, facebookAppName);
  configureFacebookSettingsAndroid(facebookAppId);
};
