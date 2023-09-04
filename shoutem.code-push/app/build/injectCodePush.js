const {
  getAppGradlePath,
  getSettingsGradlePath,
  getAppDelegatePath,
  getResStringsPath,
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
    ANCHORS.ANDROID.GRADLE.APP.PLUGINS_END,
    codepush.android.app.gradle.codepushGradle,
  );

  // android/settings.gradle mods
  const settingsGradlePath = getSettingsGradlePath({ cwd: projectPath });
  inject(
    settingsGradlePath,
    ANCHORS.ANDROID.GRADLE.SETTINGS_END,
    codepush.android.app.settings,
  );

  // android/app/src/main/res/values mods
  const androidResStringsPath = getResStringsPath({ cwd: projectPath });
  inject(
    androidResStringsPath,
    ANCHORS.ANDROID.RES.VALUES.STRINGS,
    codepush.android.app.stringsCodePushKey,
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
