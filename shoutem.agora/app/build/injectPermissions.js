const {
  ANCHORS,
  getPodfileTemplatePath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');
const {
  CAMERA_PERMISSION_HANDLER,
  MIC_PERMISSION_HANDLER,
} = require('./const');

/**
 * ios/Podfile.template injects required modifications for react-native-permissions package as described
 * here: https://github.com/react-native-community/react-native-permissions#ios
 *
 * This must be run before pod install step
 */

function injectPermissionHandlerIos() {
  const podfileTemplatePath = getPodfileTemplatePath({ cwd: projectPath });

  inject(
    podfileTemplatePath,
    ANCHORS.IOS.PODFILE.EXTENSION_DEPENDENCIES,
    CAMERA_PERMISSION_HANDLER,
  );

  inject(
    podfileTemplatePath,
    ANCHORS.IOS.PODFILE.EXTENSION_DEPENDENCIES,
    MIC_PERMISSION_HANDLER,
  );
}

module.exports = { injectPermissionHandlerIos };
