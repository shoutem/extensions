const {
  injectGoogleAnalytics,
} = require('./injectGoogleAnalytics');

exports.preBuild = function preBuild(appConfiguration) {
  injectGoogleAnalytics();
};
