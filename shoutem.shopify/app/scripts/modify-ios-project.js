const fs = require('fs');
const xcode = require('xcode');
const {
  getXcodeProjectPath,
  getXcodeProjectName,
} = require('@shoutem/build-tools');

const extensionPath = '../node_modules/shoutem.shopify';
const folderPath = `${extensionPath}/ios`;
const bridgingHeaderPath = `${folderPath}/Bridging-Header.h`;

const xcodeprojPath = getXcodeProjectPath();
const xcodeProject = xcode.project(xcodeprojPath).parseSync();
const pbxGroupName = getXcodeProjectName();

const groupKey = xcodeProject.findPBXGroupKey({ name: pbxGroupName });
const target = xcodeProject.getFirstTarget().uuid;

xcodeProject.addSourceFile(`${folderPath}/MBBridge.m`, target, groupKey);
xcodeProject.addSourceFile(`${folderPath}/MBBridge.swift`, target, groupKey);
xcodeProject.addHeaderFile(`${folderPath}/Bridging-Header.h`, target, groupKey);
xcodeProject.addBuildProperty('SWIFT_OBJC_BRIDGING_HEADER', bridgingHeaderPath);
xcodeProject.addBuildProperty('SWIFT_VERSION', '4.2');

fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());
console.log('[shoutem.shopify] - iOS: added MBBridge files and properties');
console.log('[shoutem.shopify] - See shoutem.shopify/app/scripts for details');
