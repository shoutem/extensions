const {
  getAppGradlePath,
  getGradlePropertiesPath,
  getSettingsGradlePath,
  getAppDelegatePath,
  getMainApplicationPath,
  replace,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');
const { codepush } = require('./const');

/**
 * https://github.com/Microsoft/react-native-code-push/blob/master/docs/setup-android.md
 */
function injectCodePushAndroid() {
  // app/build.gradle mods
  const gradleAppPath = getAppGradlePath({ cwd: projectPath });
  inject(
    gradleAppPath,
    ANCHORS.ANDROID.GRADLE.APP.REACT_GRADLE,
    codepush.android.app.gradle.codepushGradle,
  );
  inject(
    gradleAppPath,
    ANCHORS.ANDROID.GRADLE.APP.DEPENDENCIES,
    codepush.android.app.gradle.dependencies
  );
  inject(
    gradleAppPath,
    ANCHORS.ANDROID.GRADLE.APP.BUILD_TYPES.UNSIGNED_RELEASE,
    codepush.android.app.gradle.buildTypes,
  );
  inject(
    gradleAppPath,
    ANCHORS.ANDROID.GRADLE.APP.BUILD_TYPES.DEBUG,
    codepush.android.app.gradle.buildTypes,
  );

  // android/settings.gradle mods
  const settingsGradlePath = getSettingsGradlePath({ cwd: projectPath });
  inject(
    settingsGradlePath,
    ANCHORS.ANDROID.GRADLE.SETTINGS,
    codepush.android.app.settings,
  );

  // app/settings.properties mods
  const gradlePropertiesPath = getGradlePropertiesPath({ cwd: projectPath });
  inject(
    gradlePropertiesPath,
    ANCHORS.ANDROID.GRADLE.PROPERTIES,
    codepush.android.app.gradle.codepushKey,
  );

  // MainApplication.java mods
  const mainApplicationPath = getMainApplicationPath({ cwd: projectPath });
  inject(
    mainApplicationPath,
    ANCHORS.ANDROID.MAIN_APPLICATION.IMPORT,
    codepush.android.app.import,
  );
  inject(
    mainApplicationPath,
    ANCHORS.ANDROID.MAIN_APPLICATION.RN_HOST_BODY,
    codepush.android.app.rnHost,
  );
  inject(
    mainApplicationPath,
    ANCHORS.ANDROID.MAIN_APPLICATION.GET_PACKAGES,
    codepush.android.app.getPackages,
  );
}

/**
 * https://github.com/Microsoft/react-native-code-push/blob/master/docs/setup-ios.md
 */
function injectCodePushIos() {
  const appDelegate = getAppDelegatePath({ cwd: projectPath });
  inject(appDelegate, ANCHORS.IOS.APP_DELEGATE.IMPORT, codepush.ios.appDelegate.import);
  replace(appDelegate, codepush.ios.appDelegate.oldBundle, codepush.ios.appDelegate.newBundle);
}

module.exports = {
  injectCodePushAndroid,
  injectCodePushIos,
};
