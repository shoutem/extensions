const injectReactNativeCamera = require('./injectCamera');

function preBuild() {
  injectReactNativeCamera();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
