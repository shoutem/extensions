const {
  getXcodeProjectPath,
  getXcodeProjectName,
  prependProjectPath,
} = require('@shoutem/build-tools');
const fs = require('fs');
const xcode = require('xcode');

const placeholderPath = prependProjectPath('ios/RNPlaceholder.swift');

if (!fs.existsSync(placeholderPath)) {
  console.log('[shoutem.audio] - Creating dummy Swift file at', placeholderPath);
  fs.writeFileSync(placeholderPath, '');
}

const xcodeProjectPath = getXcodeProjectPath();
const xcodeProject = xcode.project(xcodeProjectPath).parseSync();
const pbxGroupName = getXcodeProjectName();
const target = xcodeProject.getFirstTarget().uuid;
const groupKey = xcodeProject.findPBXGroupKey({ name: pbxGroupName });

xcodeProject.addSourceFile(placeholderPath, target, groupKey);
xcodeProject.addBuildProperty('SWIFT_VERSION', '5.0');
fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());

const packagePath = prependProjectPath('package.json');
const package = require(packagePath);
package.isSwift = true;
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
