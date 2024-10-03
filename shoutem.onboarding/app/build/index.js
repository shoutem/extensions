const { getAppConfiguration } = require('@shoutem/build-tools');
const { composeImageList } = require('./composeImageList');

function preBuild(appConfiguration) {
  composeImageList(appConfiguration);
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
