const _ = require('lodash');
const path = require('path');
const {
  projectPath,
  files: { downloadFile },
} = require('@shoutem/build-tools');
const buildTools = require('shoutem.application/build');
const pack = require('../package.json');

const { getExtensionSettings } = buildTools.configuration;

function resolveAssetFilePath(fileName) {
  const assetsDir = path.resolve(
    projectPath,
    `extensions/${pack.name}/app/assets`,
  );

  return path.resolve(assetsDir, fileName);
}

function downloadBackgroundImage(appConfiguration) {
  const settings = getExtensionSettings(appConfiguration, pack.name);
  const backgroundImageUrl = _.get(settings, 'backgroundImage', null);

  if (!backgroundImageUrl) {
    return;
  }

  const filePath = resolveAssetFilePath('backgroundImage.png');

  downloadFile(backgroundImageUrl, filePath)
    .then(() =>
      console.log(
        `[${pack.name}]: Downloaded background image to: ${filePath}`,
      ),
    )
    .catch(err =>
      console.error(
        `[${pack.name}]: Failed to download background image.`,
        err,
      ),
    );
}

module.exports = {
  downloadBackgroundImage,
};
