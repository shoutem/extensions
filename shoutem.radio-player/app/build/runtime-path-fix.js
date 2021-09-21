const fs = require('fs-extra');
const _ = require('lodash');
const xcode = require('xcode');
const { getXcodeProjectPath } = require('@shoutem/build-tools');
const pbxprojPath = getXcodeProjectPath();
const xcodeProject = xcode.project(pbxprojPath).parseSync();
const propKey = 'LD_RUNPATH_SEARCH_PATHS';
const swiftRunpath = '/usr/lib/swift';
const requiredRunpaths =
  '/usr/lib/swift $(inherited) @executable_path/Frameworks';
function unquote(str = '') {
  return str.replace(/^"(.*)"$/, '$1');
}
function quote(str = '') {
  return `"${str}"`;
}
function getRunpaths(buildType) {
  if (buildType) {
    return xcodeProject.getBuildProperty(propKey, buildType);
  }
  return xcodeProject.getBuildProperty(propKey);
}
function determineBuildType() {
  if (!getRunpaths()) {
    const debugBuild = getRunpaths('Debug');
    const releaseBuild = getRunpaths('Release');
    if (debugBuild && releaseBuild) {
      return 'both';
    }
  }
  return 'default';
}
function prependSwiftRunpath(buildType) {
  const currentPaths = getRunpaths(buildType);
  if (!currentPaths) {
    xcodeProject.addBuildProperty(propKey, requiredRunpaths, buildType);
    return;
  }
  if (_.includes(currentPaths, swiftRunpath)) {
    return;
  }
  const newRunpaths = quote(`${swiftRunpath} ${unquote(currentPaths)}`);
  xcodeProject.updateBuildProperty(propKey, newRunpaths, buildType);
}
function prependAllSwiftRunpath() {
  const buildType = determineBuildType();
  if (buildType === 'default') {
    prependSwiftRunpath(undefined);
  } else {
    prependSwiftRunpath('Debug');
    prependSwiftRunpath('Release');
  }
  fs.writeFileSync(pbxprojPath, xcodeProject.writeSync());
}
module.exports = {
  prependAllSwiftRunpath,
};
