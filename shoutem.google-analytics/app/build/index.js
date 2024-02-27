const { injectFirebaseSettingsFile } = require('./injectFirebaseSettingsFile');

function preBuild() {
  injectFirebaseSettingsFile();
}

module.exports = {
  preBuild,
  runPreBuild: preBuild,
};
