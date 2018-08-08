const path = require('path');
const fs = require('fs-extra');
const xcode = require('xcode');
const execSync = require('child_process').execSync;
const {
  getXcodeProjectPath,
  projectPath,
} = require('@shoutem/build-tools');

function injectGoogleAnalyticsFrameworks() {
  return new Promise((resolve, reject) => {
    console.log('Linking GoogleAnalytics frameworks to iOS project - [Running...]');
    const xcodeProjPath = getXcodeProjectPath({ cwd: path.resolve(projectPath, 'ios') });
    const xcodeProj = xcode.project(xcodeProjPath);
    xcodeProj.parse(error => {
      if (error) {
        reject(error);
      }

      xcodeProj.addFramework('CoreData.framework', { embed: true });
      xcodeProj.addFramework('SystemConfiguration.framework', { embed: true });
      xcodeProj.addFramework('libz.tbd', { embed: true });
      xcodeProj.addFramework('libsqlite3.0.tbd', { embed: true });

      fs.writeFileSync(xcodeProjPath, xcodeProj.writeSync())

      console.log('Linking GoogleAnalytics frameworks to iOS project - [OK]');
      resolve();
    })
  });
}

function injectGoogleAnalyticsIos() {
  if (process.platform !== 'darwin') {
    console.log('iOS linking for FBSDK is available only on OSX - [Skipping...]');
    return;
  }

  injectGoogleAnalyticsFrameworks();
}

function injectGoogleAnalytics() {
  injectGoogleAnalyticsIos();
}

module.exports = {
  injectGoogleAnalytics,
};
