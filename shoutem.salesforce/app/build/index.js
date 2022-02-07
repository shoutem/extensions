const { getAppConfiguration } = require('@shoutem/build-tools');
const { injectIOS } = require('./injectIOS');
const { injectAndroid } = require('./injectAndroid');

function preBuild(appConfiguration) {
  injectIOS(appConfiguration);
  injectAndroid(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
