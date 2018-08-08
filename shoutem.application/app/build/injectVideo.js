const {
  getAppDelegatePath,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');
const { video } = require('./const');

/**
 * Injects required modifications for react-native-splash-screen as described
 * here: https://github.com/crazycodeboy/react-native-splash-screen#installation
 */
function injectVideo() {
  // modify iOS project
  const appDelegate = getAppDelegatePath({ cwd: projectPath });
  inject(
    appDelegate,
    ANCHORS.IOS.APP_DELEGATE.IMPORT,
    video.ios.appDelegate.import
  );
  inject(
    appDelegate,
    ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS_END,
    video.ios.appDelegate.didFinishLaunching
  );
}

module.exports = injectVideo;
