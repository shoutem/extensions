const { injectPermissionHandlerIos } = require('./injectPermissions');

function preBuild() {
  injectPermissionHandlerIos();
}

module.exports = {
  preBuild,
  runPreBuild: () => preBuild(),
};
