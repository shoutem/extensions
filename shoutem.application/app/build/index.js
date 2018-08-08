'use strict';

const injectReactNativeMaps = require('./injectMaps');
const injectReactNativeSplashScreen = require('./injectSplashScreen');
const injectReactNativeVideo = require('./injectVideo');
const files = require('./files');
const configuration = require('./configuration');

exports.files = files;
exports.configuration = configuration;

const { writeJsonToFile } = files;

exports.preBuild = function preBuild(appConfiguration, buildConfiguration) {
  injectReactNativeMaps();
  injectReactNativeSplashScreen();
  injectReactNativeVideo();

  const configurationJson = buildConfiguration.release ? appConfiguration : {};
  writeJsonToFile('configuration.json', configurationJson);
  writeJsonToFile('buildConfig.json', buildConfiguration);
};
