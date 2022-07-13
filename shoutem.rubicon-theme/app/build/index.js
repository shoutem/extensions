const { getAppConfiguration } = require('@shoutem/build-tools');
const { composeTheme } = require('./composeTheme');

function preBuild(appConfiguration) {
  composeTheme(appConfiguration);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  previewBuild: preBuild,
  runPreBuild,
};
