const {
  getAppDelegatePath,
  getMainApplicationPath,
  replace,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');
const { liveUpdate } = require('./const');

function injectLiveUpdateAndroid() {
  // MainApplication.java mods
  const mainApplicationPath = getMainApplicationPath({ cwd: projectPath });
  inject(
    mainApplicationPath,
    ANCHORS.ANDROID.MAIN_APPLICATION.IMPORT,
    liveUpdate.android.app.import,
  );
  inject(
    mainApplicationPath,
    ANCHORS.ANDROID.MAIN_APPLICATION.RN_HOST_BODY,
    liveUpdate.android.app.rnHost,
  );
}

function injectLiveUpdateIos() {
  const appDelegate = getAppDelegatePath({ cwd: projectPath });
  inject(
    appDelegate,
    ANCHORS.IOS.APP_DELEGATE.IMPORT,
    liveUpdate.ios.appDelegate.import,
  );
  replace(
    appDelegate,
    liveUpdate.ios.appDelegate.oldBundle,
    liveUpdate.ios.appDelegate.newBundle,
  );
}

module.exports = {
  injectLiveUpdateAndroid,
  injectLiveUpdateIos,
};
