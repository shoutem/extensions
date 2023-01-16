const { getAppConfiguration } = require('@shoutem/build-tools');
const { downloadFonts } = require('./downloadFonts');

function preBuild(appConfiguration) {
  downloadFonts(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
