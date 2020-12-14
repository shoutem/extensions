const { injectPermissionHandlerIos } = require('./injectPermissions');

exports.preBuild = function preBuild() {
  injectPermissionHandlerIos();
};
