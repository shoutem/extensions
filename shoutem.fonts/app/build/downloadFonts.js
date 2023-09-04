require('colors');
const _ = require('lodash');
const fs = require('fs-extra');
const path = require('path');
const { execSync } = require('child_process');
const {
  projectPath,
  files: { downloadFile },
} = require('@shoutem/build-tools');
const pack = require('../package.json');

const FONT_ASSET_DIR = path.resolve(
  projectPath,
  `extensions/${pack.name}/app/fonts`,
);

const getExtension = appConfiguration => {
  const includedResources = _.get(appConfiguration, 'included');
  const extension = _.find(includedResources, {
    type: 'shoutem.core.extensions',
    id: pack.name,
  });

  return extension;
};

const getExtensionSettings = appConfiguration => {
  const extension = getExtension(appConfiguration);
  return _.get(extension, 'attributes.settings');
};

function ensureFontsFilePath() {
  const assetsSoundDir = path.resolve(
    projectPath,
    `extensions/${pack.name}/app/fonts`,
  );

  if (!fs.existsSync(assetsSoundDir)) {
    fs.mkdirSync(assetsSoundDir);
  }
}

function downloadFont(fontConfig) {
  console.log(`Downloading ${fontConfig.name} font`);

  const fontDownloadPaths = _.values(_.omit(fontConfig, ['name', 'default']));
  const fontFileNames = _.map(
    fontDownloadPaths,
    fontUrl => /[^/]*$/.exec(fontUrl)[0],
  );
  const downloadPromises = _.map(fontDownloadPaths, fontUrl => {
    const fileName = /[^/]*$/.exec(fontUrl)[0];
    const filePath = path.resolve(FONT_ASSET_DIR, fileName);

    return downloadFile(fontUrl, filePath);
  });

  return Promise.all(downloadPromises)
    .then(() => {
      console.log(`Downloaded ${fontConfig.name} font`.bold.green);
      console.log(`Renaming font files to ${fontConfig.name}`);

      // Fallback for old default fonts like Rubik-Regular
      const resolvedFontName = fontConfig.name.split('-')[0];
      const fontRenameCommand = `python3 ../build/fontname.py ${resolvedFontName} ${_.join(
        fontFileNames,
        ' ',
      )}`;

      execSync(fontRenameCommand, { cwd: FONT_ASSET_DIR });
    })
    .catch(() => {
      const errorMessage = `Downloading ${fontConfig.name} FAILED`.bold.red;
      throw errorMessage;
    });
}

function downloadFonts(appConfiguration) {
  ensureFontsFilePath();

  const fontList = _.get(appConfiguration, 'data.relationships.fonts.data', []);
  const extensionSettings = getExtensionSettings(appConfiguration);
  const { excludedFonts } = extensionSettings;

  // Exclude default but excluded fonts
  const fonts = _.compact(
    _.map(fontList, fontData =>
      _.find(
        appConfiguration.included,
        item =>
          item.id === fontData.id &&
          item.type === fontData.type &&
          !_.includes(excludedFonts, item.id),
      ),
    ),
  );

  const fontsToDownload = _.map(fonts, fontData =>
    downloadFont(fontData.attributes),
  );

  if (fonts.length) {
    Promise.all(fontsToDownload)
      .then(() => {
        console.log('Font download complete, adding asset linking path');
        const extPackageJsonPath = path.resolve(
          projectPath,
          `extensions/${pack.name}/app/package.json`,
        );
        const extPackageJson = fs.readJsonSync(extPackageJsonPath);
        const { assets: existingAssets = [] } = extPackageJson;
        const newPackageJson = {
          ...extPackageJson,
          assets: [...existingAssets, FONT_ASSET_DIR],
        };

        fs.writeJsonSync(extPackageJsonPath, newPackageJson, { spaces: 2 });
      })
      .catch(e => {
        throw new Error(e);
      });
  }
}

module.exports = {
  downloadFonts,
};
