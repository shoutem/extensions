const _ = require('lodash');
const fs = require('fs-extra');
const plist = require('plist');
const { ext, DEFAULT_ADMOB_APPS } = require('./const');

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

const getExtension = (appConfiguration, extensionName) => {
  const includedResources = appConfiguration?.included;
  const extension = _.find(includedResources, {
    type: 'shoutem.core.extensions',
    id: extensionName,
  });

  return extension;
};

const getExtensionSettings = (appConfiguration, extensionName) => {
  const extension = getExtension(appConfiguration, extensionName);
  return extension?.attributes?.settings;
};

/**
 * Adding GADApplicationIdentifier and SKAdNetworkItems keys per AdMob instructions.
 * https://developers.google.com/admob/ios/quick-start#update_your_infoplist
 */

function injectAdMobPlistData(appConfiguration) {
  const plistPath = 'ios/Info.plist';
  const currentPlistContents = parsePlist(plistPath);
  const extSettings = getExtensionSettings(appConfiguration, ext());
  const iOSAdAppId = _.get(extSettings, 'iOSAdAppId', DEFAULT_ADMOB_APPS.IOS);

  const adMobPlistData = {
    GADApplicationIdentifier: iOSAdAppId,
    SKAdNetworkItems: [{ SKAdNetworkIdentifier: 'cstr6suwn9.skadnetwork' }],
  };

  const adInfoPlist = Object.assign(currentPlistContents, adMobPlistData);

  fs.writeFileSync(plistPath, plist.build(adInfoPlist));
}

module.exports = {
  injectAdMobPlistData,
};
