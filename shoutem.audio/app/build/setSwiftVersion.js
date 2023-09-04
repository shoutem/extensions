const {
  getXcodeProjectPath,
  getXcodeProjectName,
  prependProjectPath,
  projectPath,
} = require('@shoutem/build-tools');
const fs = require('fs');
const xcode = require('xcode');

function setSwiftVersion() {
  const placeholderPath = prependProjectPath('ios/RNPlaceholder.swift');

  if (fs.existsSync(placeholderPath)) {
    console.log('[shoutem.audio] - Dummy Swift file present at', placeholderPath, ' -skipping...');
    return;
  }

  console.log('[shoutem.audio] - Creating dummy Swift file at', placeholderPath);
  fs.writeFileSync(placeholderPath, '');

  const xcodeProjectPath = getXcodeProjectPath({ cwd: `${projectPath}/ios` });
  const xcodeProject = xcode.project(xcodeProjectPath).parseSync();
  const pbxGroupName = getXcodeProjectName({ cwd: `${projectPath}/ios` });
  const target = xcodeProject.getFirstTarget().uuid;
  const groupKey = xcodeProject.findPBXGroupKey({ name: pbxGroupName });

  xcodeProject.addSourceFile(placeholderPath, target, groupKey);
  xcodeProject.addBuildProperty('SWIFT_VERSION', '5.0');
  fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());

  const packagePath = prependProjectPath('package.json');
  const package = require(packagePath);
  package.isSwift = true;
  fs.writeFileSync(packagePath, JSON.stringify(package, null, 2));
}

module.exports = {
  setSwiftVersion
};
