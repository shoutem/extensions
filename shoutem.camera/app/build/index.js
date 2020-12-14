'use strict';

const injectReactNativeCamera = require('./injectCamera');

exports.preBuild = function preBuild(appConfiguration, buildConfiguration) {
  injectReactNativeCamera();
};
