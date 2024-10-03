const {
  getAppConfiguration,
  getBuildConfiguration,
  addWebAliases,
} = require('@shoutem/build-tools');
const configuration = require('./configuration');
const files = require('./files');
const { aliases } = require('./const');
const injectReactNativeMaps = require('./injectMaps');
const injectReactNativeSplashScreen = require('./injectSplashScreen');

const { writeJsonToFile } = files;

function preBuild(appConfiguration, buildConfiguration) {
  injectReactNativeMaps(buildConfiguration);
  injectReactNativeSplashScreen();

  const configurationJson = buildConfiguration.release ? appConfiguration : {};
  writeJsonToFile('configuration.json', configurationJson);
  writeJsonToFile('buildConfig.json', buildConfiguration);
}

function previewBuild(appConfiguration, buildConfiguration) {
  const configurationJson = buildConfiguration.release ? appConfiguration : {};
  writeJsonToFile('configuration.json', configurationJson);
  writeJsonToFile('buildConfig.json', buildConfiguration);

  addWebAliases(aliases);
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
  previewBuild,
};
