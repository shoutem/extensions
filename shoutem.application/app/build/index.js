const {
  getAppConfiguration,
  getBuildConfiguration,
} = require('@shoutem/build-tools');
const configuration = require('./configuration');
const files = require('./files');
const injectReactNativeMaps = require('./injectMaps');
const injectReactNativeSplashScreen = require('./injectSplashScreen');

const { writeJsonToFile } = files;

function preBuild(appConfiguration, buildConfiguration) {
  injectReactNativeMaps();
  injectReactNativeSplashScreen();

  const configurationJson = buildConfiguration.release ? appConfiguration : {};
  writeJsonToFile('configuration.json', configurationJson);
  writeJsonToFile('buildConfig.json', buildConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  const buildConfiguration = getBuildConfiguration();
  preBuild(appConfiguration, buildConfiguration);
}

module.exports = {
  files,
  configuration,
  preBuild,
  runPreBuild,
};
