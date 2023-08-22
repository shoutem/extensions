const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const buildTools = require('shoutem.application/build');
const { name: extName } = require('../package.json');

const { getExtensionSettings } = buildTools.configuration;
const {
  projectPath,
  files: { downloadFile },
} = require('@shoutem/build-tools');

const SOUND_ASSETS_DIR = path.resolve(
  projectPath,
  'extensions',
  extName,
  'app',
  'assets',
  'sounds',
);

function resolveAssetFilePath(chimeFileName) {
  fs.ensureDirSync(SOUND_ASSETS_DIR);

  return path.resolve(SOUND_ASSETS_DIR, chimeFileName);
}

function downloadChimeSound(appConfiguration) {
  const settings = getExtensionSettings(appConfiguration, extName);
  const chimeUrl = _.get(settings, 'chime.fileUrl', null);
  const chimeFileName = _.get(settings, 'chime.fileName', null);

  if (!chimeUrl || !chimeFileName) {
    return;
  }

  const filePath = resolveAssetFilePath(chimeFileName);

  downloadFile(chimeUrl, filePath)
    .then(() => {
      const extPackageJsonPath = path.resolve(
        projectPath,
        `extensions/${extName}/app/package.json`,
      );
      const extPackageJson = fs.readJsonSync(extPackageJsonPath);
      const { assets: existingAssets = [] } = extPackageJson;
      const newPackageJson = {
        ...extPackageJson,
        assets: [...existingAssets, SOUND_ASSETS_DIR],
      };

      fs.writeJsonSync(extPackageJsonPath, newPackageJson, { spaces: 2 });
    })
    .catch(err => console.error('Failed to download chime sound.', err));
}

module.exports = {
  downloadChimeSound,
};
