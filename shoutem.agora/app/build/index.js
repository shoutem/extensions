const { injectAgoraSubspecs } = require('./injectAgoraSubspecs');
const { injectForegroundService } = require('./injectForegroundService');

async function preBuild() {
  injectAgoraSubspecs();
  injectForegroundService();
}

function runPreBuild() {
  preBuild();
}

module.exports = {
  preBuild,
  runPreBuild,
};
