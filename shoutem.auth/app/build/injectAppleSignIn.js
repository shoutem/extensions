const _ = require('lodash');
const {
  ANCHORS,
  getAppEntitlementsPath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');
const { appleSignIn } = require('./const');

function injectAppleSignInIos(extensionSettings) {
  const appleSettings = _.get(extensionSettings, 'providers.apple');
  const isAppleSignInEnabled = _.get(appleSettings, 'enabled', false);

  if (!isAppleSignInEnabled) {
    return;
  }

  const appEntitlement = getAppEntitlementsPath({ cwd: projectPath });
  inject(
    appEntitlement,
    ANCHORS.IOS.ENTITLEMENTS.ADD_ENTITLEMENTS,
    appleSignIn.ios.entitlements.addEntitlement,
  );
}

module.exports = {
  injectAppleSignInIos,
};
