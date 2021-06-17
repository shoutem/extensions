const { getAppConfiguration } = require('@shoutem/build-tools');
const { updateInfoPlist } = require('./add-background-modes');

function preBuild(appConfiguration) {
  updateInfoPlist(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
