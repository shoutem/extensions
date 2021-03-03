const { getAppConfiguration } = require('@shoutem/build-tools');
const { injectTrackPlayer } = require('./injectTrackPlayer');
const { updateInfoPlist } = require('./add-background-modes');

function preBuild(appConfiguration) {
  updateInfoPlist(appConfiguration);
  injectTrackPlayer();
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
