const { getAppConfiguration } = require('@shoutem/build-tools');
const { injectAndroid } = require('./injectAndroid');
const { injectAdMobPlistData } = require('./injectAdMobPlistData');
const { setSwiftVersion } = require('./setSwiftVersion');

function preBuild(appConfiguration) {
  injectAndroid(appConfiguration);
  injectAdMobPlistData(appConfiguration);
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
