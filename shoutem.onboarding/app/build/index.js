const { composeImageList } = require('./composeImageList');

function preBuild(appConfiguration) {
  composeImageList(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild: preBuild,
};
