const { injectTrackPlayer } = require('./injectTrackPlayer');
const { updateInfoPlist } = require('./add-background-modes');

exports.preBuild = function preBuild(appConfiguration) {
  updateInfoPlist(appConfiguration);
  injectTrackPlayer();
};
