/* eslint-disable max-len */
const {
  getAppDelegatePath,
  inject,
  ANCHORS,
  projectPath,
} = require('@shoutem/build-tools');

const appDelegateImport = '#import <Firebase.h>';
const appDelegateHasFinishedLaunching = `
if ([FIRApp defaultApp] == nil) {
  [FIRApp configure];
}
`;

function injectIos() {
  // appDelegate.m mods
  const appDelegatePath = getAppDelegatePath({ cwd: projectPath });
  inject(appDelegatePath, ANCHORS.IOS.APP_DELEGATE.IMPORT, appDelegateImport);
  inject(
    appDelegatePath,
    ANCHORS.IOS.APP_DELEGATE.DID_FINISH_LAUNCHING_WITH_OPTIONS,
    appDelegateHasFinishedLaunching,
  );
}

function injectFirebase() {
  injectIos();
}

module.exports = {
  injectFirebase,
};
