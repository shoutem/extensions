const fs = require('fs-extra');
const glob = require('glob');
const _ = require('lodash');
const path = require('path');
const xcode = require('xcode');
const buildTools = require('shoutem.application/build');

const { getExtensionSettings } = buildTools.configuration;
const {
  projectPath,
  files: { downloadFile },
} = require('@shoutem/build-tools');

function resolveAssetFilePath(chimeFileName) {
  const assetsSoundDir = path.resolve(projectPath, 'assets/sound');

  fs.ensureDirSync(assetsSoundDir);

  return path.resolve(assetsSoundDir, chimeFileName);
}

function resolveAndroidPath(chimeFileName) {
  const androidFileDir = path.resolve(
    projectPath,
    'android/app/src/main/res/raw',
  );

  if (!fs.existsSync(androidFileDir)) {
    fs.mkdirSync(androidFileDir);
  }

  return path.resolve(androidFileDir, chimeFileName);
}

function androidInjectChimeSound(filePath, chimeFileName) {
  const androidFilePath = resolveAndroidPath(chimeFileName);

  fs.copyFile(filePath, androidFilePath, err => {
    if (err) {
      console.error(
        'Failed copying chime file to Android resources folder',
        err,
      );
      process.exit(1);
    }
  });

  console.log(`Android: Added ${chimeFileName} to Android resources`);
}

function iosInjectChimeSound(filePath, chimeFileName) {
  const xcodeProjects = glob.sync(
    `${projectPath}/ios/*.xcodeproj/project.pbxproj`,
  );

  if (xcodeProjects && xcodeProjects.length > 1) {
    console.warn(
      `WARNING! More than one XCode project found. The ${chimeFileName} chime sound file will be added to each project`,
    );
  } else if (_.isEmpty(xcodeProjects)) {
    console.error(
      'Are you sure you are in a React Native project directory? Xcode project file could not be found.',
    );
    process.exit(1);
  }

  xcodeProjects.forEach(xcodeprojPath => {
    const xcodeProject = xcode.project(xcodeprojPath).parseSync();
    const projectUuid = xcodeProject.getFirstTarget().uuid;

    xcodeProject.addResourceFile(filePath, { target: projectUuid });
    fs.writeFileSync(xcodeprojPath, xcodeProject.writeSync());

    console.log(`iOS: Added ${chimeFileName} to ${xcodeprojPath} resources`);
  });
}

function injectChimeSound(appConfiguration) {
  const settings = getExtensionSettings(
    appConfiguration,
    'shoutem.notification-center',
  );
  const chimeUrl = _.get(settings, 'chime.fileUrl', null);
  const chimeFileName = _.get(settings, 'chime.fileName', null);

  if (!chimeUrl || !chimeFileName) {
    return;
  }

  const filePath = resolveAssetFilePath(chimeFileName);

  downloadFile(chimeUrl, filePath)
    .then(() => {
      androidInjectChimeSound(filePath, chimeFileName);
      iosInjectChimeSound(filePath, chimeFileName);
    })
    .catch(err => console.error('Failed injecting chime sound.', err));
}

module.exports = {
  injectChimeSound,
};
