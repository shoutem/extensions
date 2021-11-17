const { getAppConfiguration } = require('@shoutem/build-tools');
const { injectAndroid } = require('./injectAndroid');
const { injectAdMobPlistData } = require('./injectAdMobPlistData');

function preBuild(appConfiguration) {
  injectAndroid(appConfiguration);
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
