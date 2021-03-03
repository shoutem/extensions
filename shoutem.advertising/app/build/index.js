const { getAppConfiguration } = require('@shoutem/build-tools');
const { injectFirebaseSettings } = require('./injectFirebaseSettings');
const { injectAdMobPlistData } = require('./injectAdMobPlistData');

function preBuild(appConfiguration) {
  injectFirebaseSettings(appConfiguration);
  injectAdMobPlistData(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
