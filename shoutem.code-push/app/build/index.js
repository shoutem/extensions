const { injectCodePushAndroid, injectCodePushIos } = require('./injectCodePush');

exports.preBuild = function preBuild() {
  injectCodePushAndroid();
  injectCodePushIos();
}
