/* eslint-disable max-len */
const {
  getAppGradlePath,
  getAppDelegateHeaderPath,
  getAppDelegatePath,
  getRootGradlePath,
  inject,
  replace,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');
const { firebase } = require('./const');

function injectIos() {
  // appDelegate.m mods
  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.IMPORT, firebase.ios.appDelegate.import);
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS, firebase.ios.appDelegate.didFinishLaunchingWithOptions);
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.BODY, firebase.ios.appDelegate.body);

  // appDelegate.h mods
  const appDelegateHeaderPath = getAppDelegateHeaderPath({ cwd: projectPath });
  inject(appDelegateHeaderPath, ANCHORS.IOS.APP_DELEGATE_HEADER.IMPORT, firebase.ios.appDelegateHeader.import);

  firebase.ios.appDelegateHeader.replace.forEach((searchReplace) => {
    replace(appDelegateHeaderPath, searchReplace[0], searchReplace[1]);
  });
}

function injectAndroid() {
  // app/build.gradle mods
  const appGradlePath = getAppGradlePath({ cwd: projectPath });
  inject(appGradlePath, ANCHORS.ANDROID.GRADLE.APP.PLUGINS, firebase.android.gradle.app.plugins);
  inject(appGradlePath, ANCHORS.ANDROID.GRADLE.APP.DEPENDENCIES, firebase.android.gradle.app.dependencies);

  const rootGradlePath = getRootGradlePath({ cwd: projectPath });
  inject(rootGradlePath, ANCHORS.ANDROID.GRADLE.ROOT_GRADLE, firebase.android.gradle.rootGradle);
}

function injectFirebase() {
  injectIos();
  injectAndroid();
}

module.exports = {
  injectFirebase,
};
