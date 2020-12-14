const { injectFirebaseSettings } = require('./injectFirebaseSettings');
const { injectAdMobPlistData } = require('./injectAdMobPlistData')

exports.preBuild = function preBuild(appConfiguration) {
  injectFirebaseSettings(appConfiguration);
  injectAdMobPlistData(appConfiguration)
};
