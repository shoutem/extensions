const { projectPath } = require('@shoutem/build-tools');

/**
 * Injects required modifications for react-native-splash-screen as described
 * here: https://github.com/crazycodeboy/react-native-splash-screen#installation
 */
function injectSplashScreen() {
  const { getAppDelegatePath, getMainActivityPath, inject, ANCHORS } = require('@shoutem/build-tools');
  const { splashScreen } = require('./const');

  // modify iOS project
  const appDelegate = getAppDelegatePath({ cwd: projectPath });
  inject(appDelegate, ANCHORS.IOS.APP_DELEGATE.IMPORT, splashScreen.ios.appDelegate.import);
  inject(appDelegate, ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS_END, splashScreen.ios.appDelegate.didFinishLaunchingEnd);

  // modify Android project
  const mainActivity = getMainActivityPath({ cwd: projectPath });
  inject(mainActivity, ANCHORS.ANDROID.MAIN_ACTIVITY.IMPORT, splashScreen.android.mainActivity.import);
  inject(mainActivity, ANCHORS.ANDROID.MAIN_ACTIVITY.ON_CREATE, splashScreen.android.mainActivity.onCreate);
}

module.exports = injectSplashScreen;
