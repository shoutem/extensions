const {
  injectLiveUpdateAndroid,
  injectLiveUpdateIos,
} = require('./injectLiveUpdate');

function preBuild() {
  injectLiveUpdateAndroid();
  injectLiveUpdateIos();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
