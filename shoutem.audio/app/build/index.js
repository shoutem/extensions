const { getAppConfiguration } = require('@shoutem/build-tools');
const { updateInfoPlist } = require('./add-background-modes');
const { setSwiftVersion } = require('./setSwiftVersion');
const { injectForegroundService } = require('./injectForegroundService');

function preBuild(appConfiguration) {
  updateInfoPlist(appConfiguration);
  setSwiftVersion();
  injectForegroundService();
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
