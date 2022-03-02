const _ = require('lodash');
const fs = require('fs-extra');
const { ext } = require('./const');
const path = require('path');
const {
  projectPath,
  files: { downloadFile },
} = require('@shoutem/build-tools');
const pack = require('../package.json');

const getExtension = (appConfiguration, extensionName) => {
  const includedResources = _.get(appConfiguration, 'included');
  const extension = _.find(includedResources, {
    type: 'shoutem.core.extensions',
    id: extensionName,
  });

  return extension;
};

const getExtensionSettings = (appConfiguration, extensionName) => {
  const extension = getExtension(appConfiguration, extensionName);
  return _.get(extension, 'attributes.settings');
};

function resolveAssetFilePath(imageName) {
  const assetsSoundDir = path.resolve(
    projectPath,
    `extensions/${pack.name}/app/assets`,
  );

  if (!fs.existsSync(assetsSoundDir)) {
    fs.mkdirSync(assetsSoundDir);
  }

  return path.resolve(assetsSoundDir, imageName);
}

function formatAssetIndexFile(name, imagePath) {
  const indexPath = resolveAssetFilePath('index.js');
  const searchText = '{';
  const replaceText = `{\n\t${name}: require('./${imagePath}'),`;
  const fileContents = fs.readFileSync(indexPath, 'utf8');

  const newFileContents = fileContents.replace(searchText, replaceText);

  return fs.writeFileSync(indexPath, newFileContents, 'utf8');
}

function composeImageList(appConfiguration) {
  const extSettings = getExtensionSettings(appConfiguration, ext());
  const pageSettings = _.get(extSettings, 'pageSettings', []);
  const defaultImage = 'defaultBackground.png';
  const promises = _.reduce(
    pageSettings,
    (result, page, index) => {
      const imageName = `image${index.toString()}`;
      const featuredImageName = `featuredImage${index.toString()}`;
      const filePath = resolveAssetFilePath(`${imageName}.png`);
      const featuredFiledPath = resolveAssetFilePath(
        `${featuredImageName}.png`,
      );

      if (page.imageUrl) {
        result.push(
          downloadFile(page.imageUrl, filePath).then(() =>
            formatAssetIndexFile(imageName, `${imageName}.png`),
          ),
        );
      }

      if (!page.imageUrl) {
        result.push(formatAssetIndexFile(imageName, defaultImage));
      }

      if (page.featuredImageUrl) {
        result.push(
          downloadFile(page.featuredImageUrl, featuredFiledPath).then(() =>
            formatAssetIndexFile(featuredImageName, `${featuredImageName}.png`),
          ),
        );
      }

      return result;
    },
    [],
  );

  Promise.all(promises).then(() =>
    console.log(`[${pack.name}]: downloaded and indexed background images`),
  );
}

module.exports = {
  composeImageList,
};
