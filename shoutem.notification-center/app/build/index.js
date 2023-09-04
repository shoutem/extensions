const { getAppConfiguration } = require('@shoutem/build-tools');
const { downloadChimeSound } = require('./downloadChimeSound');

function preBuild(appConfiguration) {
  downloadChimeSound(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
