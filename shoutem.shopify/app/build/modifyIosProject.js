const fs = require('fs');
const path = require('path');
const xcode = require('xcode');
const {
  getXcodeProjectPath,
  getXcodeProjectName,
  projectPath,
} = require('@shoutem/build-tools');
const { name: extName } = require('../package.json');

function modifyIosProject() {
  const rootIosPath = path.resolve(projectPath, 'ios');
  const xcodeprojPath = getXcodeProjectPath({ cwd: rootIosPath });
  const xcodeProject = xcode.project(xcodeprojPath).parseSync();
  const pbxGroupName = getXcodeProjectName({ cwd: rootIosPath });
  const groupKey = xcodeProject.findPBXGroupKey({ name: pbxGroupName });
  const target = xcodeProject.getFirstTarget().uuid;
  const extensionIosPath = path.resolve(
    projectPath,
    'extensions',
    extName,
    'app',
    'ios',
  );
  const bridgingHeaderPath = path.resolve(
    extensionIosPath,
    'Bridging-Header.h',
  );

  xcodeProject.addSourceFile(
    path.resolve(extensionIosPath, 'MBBridge.m'),
    target,
    groupKey,
  );
  xcodeProject.addSourceFile(
    path.resolve(extensionIosPath, 'MBBridge.swift'),
    target,
    groupKey,
  );
  xcodeProject.addHeaderFile(bridgingHeaderPath, target, groupKey);
  xcodeProject.addBuildProperty(
    'SWIFT_OBJC_BRIDGING_HEADER',
    bridgingHeaderPath,
  );
  xcodeProject.addBuildProperty('SWIFT_VERSION', '4.2');

  fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());
  console.log(`${extName} - iOS: added MBBridge files and properties`);
  console.log(`${extName} - See shoutem.shopify/app/scripts for details`);
}

module.exports = modifyIosProject;
