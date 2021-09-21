const { getAppConfiguration } = require('@shoutem/build-tools');
const { injectChimeSound } = require('./injectChimeSound');

function preBuild(appConfiguration) {
  injectChimeSound(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
