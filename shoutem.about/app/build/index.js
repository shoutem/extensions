const {
  injectAndroidManifestQueries,
} = require('./injectAndroidManifestQueries');

function preBuild() {
  injectAndroidManifestQueries();
}

function runPreBuild() {
  preBuild();
}

module.exports = {
  preBuild,
  runPreBuild,
};
