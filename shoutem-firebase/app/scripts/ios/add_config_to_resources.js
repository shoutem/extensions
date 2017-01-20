'use_strict';

const fs = require('fs');
const xcode = require('xcode');

const extensionPath = '../node_modules/shoutem.firebase';
const configFilePath = `${extensionPath}/GoogleService-Info.plist`;

const xcodeprojPath = 'ios/ShoutemApp.xcodeproj/project.pbxproj';
const xcodeProject = xcode.project(xcodeprojPath).parseSync();

xcodeProject.addResourceFile(configFilePath, { target: xcodeProject.getFirstTarget().uuid });
fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());
console.log(`iOS: Added ${configFilePath} to ${xcodeprojPath} resources`);
