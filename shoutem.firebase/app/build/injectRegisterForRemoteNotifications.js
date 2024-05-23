const {
  getAppDelegatePath,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');

const registerForRemoteNotificationsCode =
  '[[UIApplication sharedApplication] registerForRemoteNotifications];';

function injectIos() {
  // appDelegate.m mods
  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });
  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS_END,
    registerForRemoteNotificationsCode,
  );
}

function injectRegisterForRemoteNotifications() {
  injectIos();
}

module.exports = {
  injectRegisterForRemoteNotifications,
};
