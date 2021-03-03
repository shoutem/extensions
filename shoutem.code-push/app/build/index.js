const {
  injectCodePushAndroid,
  injectCodePushIos,
} = require('./injectCodePush');

function preBuild() {
  injectCodePushAndroid();
  injectCodePushIos();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
