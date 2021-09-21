const _ = require('lodash');
const fs = require('fs-extra');
const { ext } = require('./const');

const writeJsonToFile = (filePath, json) => {
  fs.ensureFileSync(filePath);
  fs.writeJsonSync(filePath, json, { spaces: 2 }, err => {
    console.log(`[preBuild] Unable to save the ${filePath}: ${err}`);
  });
};

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

function composeImageList(appConfiguration) {
  const extSettings = getExtensionSettings(appConfiguration, ext());
  const pageSettings = _.get(extSettings, 'pageSettings', []);
  const imagesJson = _.reduce(
    pageSettings,
    (result, page, index) => {
      if (page.imageUrl) {
        return {
          ...result,
          [`image${index.toString()}`]: page.imageUrl,
        };
      }

      return result;
    },
    {},
  );

  writeJsonToFile('prefetchImages.json', imagesJson);
}

module.exports = {
  composeImageList,
};
