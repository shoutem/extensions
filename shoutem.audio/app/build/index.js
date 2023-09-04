const { getAppConfiguration } = require('@shoutem/build-tools');
const { updateInfoPlist } = require('./add-background-modes');
const { setSwiftVersion } = require('./setSwiftVersion');

function preBuild(appConfiguration) {
  updateInfoPlist(appConfiguration);
  setSwiftVersion();
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
