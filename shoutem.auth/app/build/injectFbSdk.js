const path = require('path');
const fs = require('fs-extra');
const xcode = require('xcode');
const execSync = require('child_process').execSync;
const {
  ANCHORS,
  getAndroidManifestPath,
  getAppDelegatePath,
  getAppGradlePath,
  getMainApplicationPath,
  getPodfileTemplatePath,
  getSettingsGradlePath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');
const { fbSdk } = require('./const');

function injectFbSdkAndroid() {
  const mainApplication = getMainApplicationPath({ cwd: projectPath });
  inject(mainApplication, ANCHORS.ANDROID.MAIN_APPLICATION.IMPORT, fbSdk.android.mainApplication.import);
  inject(mainApplication, ANCHORS.ANDROID.MAIN_APPLICATION.GET_PACKAGES, fbSdk.android.mainApplication.package);

  const androidManifestPath = getAndroidManifestPath({ cwd: projectPath });
  inject(androidManifestPath, ANCHORS.ANDROID.MANIFEST.APPLICATION, fbSdk.android.manifest);

  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  inject(appGradlePath, ANCHORS.ANDROID.GRADLE.APP.DEPENDENCIES, fbSdk.android.gradle.app.dependencies);

  const settingsGradlePath = getSettingsGradlePath({ cwd: projectPath });
  inject(settingsGradlePath, ANCHORS.ANDROID.GRADLE.SETTINGS, fbSdk.android.gradle.settings);

}

function injectFbSdkIos() {
  if (process.platform !== 'darwin') {
    console.log('iOS linking for FBSDK is available only on OSX - [Skipping...]');
    return;
  }

  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.IMPORT, fbSdk.ios.appDelegate.import);
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS_END, fbSdk.ios.appDelegate.didFinishLaunchingWithOptions);
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.BODY, fbSdk.ios.appDelegate.body);

  const podFileTemplatePath = getPodfileTemplatePath({ cwd: projectPath });
  inject(podFileTemplatePath, ANCHORS.IOS.PODFILE.EXTENSION_DEPENDENCIES, fbSdk.ios.podfile.pods);
}

/**
 * Injects required modifications for react-native-fbsdk as described
 * here: https://github.com/facebook/react-native-fbsdk
 */
function injectFbSdk() {
  injectFbSdkAndroid();
  injectFbSdkIos();
}

module.exports = {
  injectFbSdk,
};
