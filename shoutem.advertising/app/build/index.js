const { getAppConfiguration } = require('@shoutem/build-tools');
const {
  injectMobileAdsConfiguration,
} = require('./injectMobileAdsConfiguration');

function preBuild(appConfiguration) {
  injectMobileAdsConfiguration(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
