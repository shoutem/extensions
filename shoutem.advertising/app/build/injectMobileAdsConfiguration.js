const { prependProjectPath } = require('@shoutem/build-tools');
const _ = require('lodash');
const fs = require('fs-extra');

const { ext, DEFAULT_ADMOB_APPS, SK_AD_NETWORK_ITEMS } = require('./const');

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

/**
 * Adding GADApplicationIdentifier and SKAdNetworkItems keys per AdMob instructions.
 * https://developers.google.com/admob/ios/quick-start#update_your_infoplist
 */

function injectMobileAdsConfiguration(appConfiguration) {
  const extSettings = getExtensionSettings(appConfiguration, ext());
  const IOS_APP_ID = _.get(extSettings, 'iOSAdAppId', DEFAULT_ADMOB_APPS.IOS);
  const ANDROID_APP_ID = _.get(
    extSettings,
    'AndroidAdAppId',
    DEFAULT_ADMOB_APPS.ANDROID,
  );

  const appJsonPath = prependProjectPath('app.json');

  const currentAppJsonContent = fs.readFileSync(appJsonPath, 'utf8');
  const parsedAppJsonContent = JSON.parse(currentAppJsonContent);

  const newAppJsonContent = {
    ...parsedAppJsonContent,
    'react-native-google-mobile-ads': {
      android_app_id: ANDROID_APP_ID,
      ios_app_id: IOS_APP_ID,
      sk_ad_network_items: SK_AD_NETWORK_ITEMS,
    },
  };

  fs.writeFileSync(appJsonPath, JSON.stringify(newAppJsonContent, null, 2));
}

module.exports = {
  injectMobileAdsConfiguration,
};
