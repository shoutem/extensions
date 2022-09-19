const { getAppConfiguration } = require('@shoutem/build-tools');
const { downloadBackgroundImage } = require('./downloadBackgroundImage');

function preBuild(appConfiguration) {
  downloadBackgroundImage(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
