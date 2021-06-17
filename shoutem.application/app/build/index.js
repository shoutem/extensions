const {
  getAppConfiguration,
  getBuildConfiguration,
} = require('@shoutem/build-tools');
const increaseJvmMemory = require('./increaseJvmMemory');
const injectReactNativeMaps = require('./injectMaps');
const injectReactNativeSplashScreen = require('./injectSplashScreen');
const files = require('./files');
const configuration = require('./configuration');

const { writeJsonToFile } = files;

function preBuild(appConfiguration, buildConfiguration) {
  increaseJvmMemory();
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
