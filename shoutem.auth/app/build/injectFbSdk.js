const {
  ANCHORS,
  getAndroidManifestPath,
  getAppDelegatePath,
  getAppGradlePath,
  getMainApplicationPath,
  getPodfilePath,
  getSettingsGradlePath,
  inject,
  projectPath,
} = require('@shoutem/build-tools');
const { fbSdk } = require('./const');

function injectFbSdkAndroid(trackFbsdkEvents, hasAdvertisingExtension) {
  const mainApplication = getMainApplicationPath({ cwd: projectPath });
  inject(
    mainApplication,
    ANCHORS.ANDROID.MAIN_APPLICATION.IMPORT,
    fbSdk.android.mainApplication.import,
  );
  inject(
    mainApplication,
    ANCHORS.ANDROID.MAIN_APPLICATION.GET_PACKAGES,
    fbSdk.android.mainApplication.package,
  );

  const androidManifestPath = getAndroidManifestPath({ cwd: projectPath });
  const shouldAutoLogAppEvents = trackFbsdkEvents ? 'true' : 'false';
  inject(
    androidManifestPath,
    ANCHORS.ANDROID.MANIFEST.APPLICATION,
    fbSdk.android.manifest.facebookActivity,
  );
  inject(
    androidManifestPath,
    ANCHORS.ANDROID.MANIFEST.APPLICATION,
    fbSdk.android.manifest.applicationMetaData,
  );
  inject(
    androidManifestPath,
    ANCHORS.ANDROID.MANIFEST.APPLICATION,
    `<meta-data android:name='com.facebook.sdk.AutoLogAppEventsEnabled' android:value='${shouldAutoLogAppEvents}'/>`,
  );
  // Injecting twice because of a weird bug with AndroidManifest merging.
  // Check replies to this answer:
  // https://stackoverflow.com/a/73170802/7920643
  if (!hasAdvertisingExtension) {
    inject(
      androidManifestPath,
      ANCHORS.ANDROID.MANIFEST.ROOT,
      fbSdk.android.manifest.removeAdIdPermission,
    );
    inject(
      androidManifestPath,
      ANCHORS.ANDROID.MANIFEST.APPLICATION,
      fbSdk.android.manifest.removeAdIdPermission,
    );
  }

  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  inject(
    appGradlePath,
    ANCHORS.ANDROID.GRADLE.APP.DEPENDENCIES,
    fbSdk.android.gradle.app.dependencies,
  );

  const settingsGradlePath = getSettingsGradlePath({ cwd: projectPath });
  inject(
    settingsGradlePath,
    ANCHORS.ANDROID.GRADLE.SETTINGS,
    fbSdk.android.gradle.settings,
  );
}

function injectFbSdkIos() {
  if (process.platform !== 'darwin') {
    // eslint-disable-next-line no-console
    console.log(
      'iOS linking for FBSDK is available only on OSX - [Skipping...]',
    );
    return;
  }

  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });
  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.IMPORT,
    fbSdk.ios.appDelegate.import,
  );
  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS,
    fbSdk.ios.appDelegate.didFinishLaunchingWithOptions,
  );
  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS_END,
    fbSdk.ios.appDelegate.didFinishLaunchingWithOptionsEnd,
  );
  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.BODY,
    fbSdk.ios.appDelegate.body,
  );

  const podfilePath = getPodfilePath({ cwd: projectPath });
  inject(
    podfilePath,
    ANCHORS.IOS.PODFILE.EXTENSION_POSTINSTALL_TARGETS,
    fbSdk.ios.podfile.postInstall,
  );
}

/**
 * Injects required modifications for react-native-fbsdk-next as described
 * here: https://developers.facebook.com/docs/android/getting-started/
 */
function injectFbSdk(extensionSettings, hasAdvertisingExtension) {
  const trackFbsdkEvents = extensionSettings?.trackFbsdkEvents;

  injectFbSdkAndroid(trackFbsdkEvents, hasAdvertisingExtension);
  injectFbSdkIos();
}

module.exports = {
  injectFbSdk,
};
