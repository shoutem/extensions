const fs = require('fs-extra');
const xcode = require('xcode');
const {
  getXcodeProjectPath,
  prependProjectPath,
} = require('@shoutem/build-tools');

function injectStoreKit() {
  const iOSdirPath = prependProjectPath('ios');
  const xcodeProjectPath = getXcodeProjectPath({ cwd: iOSdirPath });
  const xcodeProject = xcode.project(xcodeProjectPath).parseSync();

  xcodeProject.addFramework('StoreKit.framework');
  fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());

  console.log(`iOS: Added StoreKit to ${xcodeProjectPath} frameworks`);
}

module.exports = { injectStoreKit };
