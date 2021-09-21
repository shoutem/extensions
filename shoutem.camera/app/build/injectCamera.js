const {
  getAppGradlePath,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');
const { camera } = require('./const');

// cwd for build steps is extension/app directory. we want to run this on project directory

function injectAndroid() {
  // app/build.gradle mods
  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  inject(
    appGradlePath,
    ANCHORS.ANDROID.GRADLE.APP.DEFAULT_CONFIG,
    camera.android.gradle.app.defaultConfig,
  );
}

/**
 * Injects required modifications for react-native-camera package as described
 * here: https://react-native-community.github.io/react-native-camera/docs/installation.html#modifying-buildgradle
 */
function injectCamera() {
  injectAndroid();
}

module.exports = injectCamera;
