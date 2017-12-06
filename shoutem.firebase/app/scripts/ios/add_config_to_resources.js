'use_strict';

const fs = require('fs');
const xcode = require('xcode');
const glob = require('glob');
const _ = require('lodash');

const extensionPath = '../node_modules/shoutem.firebase';
const configFilePath = `${extensionPath}/GoogleService-Info.plist`;

const xcodeProjects = glob.sync('ios/*.xcodeproj/project.pbxproj')
if (xcodeProjects && xcodeProjects.length > 1) {
  console.warn([
    'WARNING!',
    'There are few XCode projects found.',
    configFilePath,
    'file will be added in each',
  ]);
} else if (_.isEmpty(xcodeProjects)) {
  console.error('Are you sure you are in React Native project? Xcode project cound not be found.');
  process.exit(1);
}

xcodeProjects.map((xcodeprojPath) => {
  const xcodeProject = xcode.project(xcodeprojPath).parseSync();

  xcodeProject.addResourceFile(configFilePath, { target: xcodeProject.getFirstTarget().uuid });
  fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());
  console.log(`iOS: Added ${configFilePath} to ${xcodeprojPath} resources`);
});
