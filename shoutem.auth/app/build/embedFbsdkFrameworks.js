const fs = require('fs-extra');
const os = require('os');
const path = require('path');
const xcode = require('xcode');
const PbxFile = require('xcode/lib/pbxFile.js');
const { getXcodeProjectPath, projectPath } = require('@shoutem/build-tools');

const xcodeProjectPath = getXcodeProjectPath({
  cwd: path.join(projectPath, 'ios'),
});
const xcodeProject = xcode.project(xcodeProjectPath).parseSync();

function addEmbededFramework(frameworkName) {
  const frameworkPath = path.join(
    'Pods',
    `${frameworkName}`,
    'XCFrameworks',
    `${frameworkName}.xcframework`,
  );

  const embededFile = new PbxFile(frameworkPath, {
    lastKnownFileType: 'wrapper.xcframework',
  });

  embededFile.uuid = xcodeProject.generateUuid();
  embededFile.fileRef = xcodeProject.generateUuid();
  embededFile.group = 'Embed Frameworks';
  embededFile.settings = embededFile.settings || {};
  embededFile.settings.ATTRIBUTES = ['CodeSignOnCopy', 'RemoveHeadersOnCopy'];

  xcodeProject.addToPbxFileReferenceSection(embededFile);
  xcodeProject.addToPbxBuildFileSection(embededFile);
  xcodeProject.addToPbxEmbedFrameworksBuildPhase(embededFile);
}

function removeOutputFileFromEmbedPodsFrameworks(frameworkName, target) {
  const embedPodsFrameworksBuildPhase = xcodeProject.buildPhaseObject(
    'PBXShellScriptBuildPhase',
    '[CP] Embed Pods Frameworks',
    target,
  );

  embedPodsFrameworksBuildPhase.outputPaths.forEach((outputPath, index) => {
    if (outputPath.includes(frameworkName)) {
      embedPodsFrameworksBuildPhase.outputPaths.splice(index, 1);
    }
  });
}

function embedFbsdkFrameworks() {
  const { uuid: target } = xcodeProject.getFirstTarget();

  const cpuCores = os.cpus();
  const isAppleProcessor = cpuCores[0].model.includes('Apple');

  // M1 Macs don't require the embedding step, it produces "Multiple commands
  // produce" errors for the FBSDK frameworks.
  if (isAppleProcessor) {
    return;
  }

  xcodeProject.addBuildPhase(
    [],
    'PBXCopyFilesBuildPhase',
    'Embed Frameworks',
    target,
    'frameworks',
  );

  const frameworksToEmbed = [
    'FBSDKCoreKit_Basics',
    'FBSDKCoreKit',
    'FBSDKGamingServicesKit',
  ];

  frameworksToEmbed.forEach(framework => addEmbededFramework(framework));

  const frameworksToRemove = [
    'FBAEMKit.framework',
    'FBSDKLoginKit.framework',
    'FBSDKShareKit.framework',
  ];

  frameworksToRemove.forEach(framework =>
    removeOutputFileFromEmbedPodsFrameworks(framework, target),
  );

  fs.writeFileSync(xcodeProjectPath, xcodeProject.writeSync());
}

module.exports = {
  embedFbsdkFrameworks,
};
