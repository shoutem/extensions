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
  const fontsDir = path.resolve(
    projectPath,
    `extensions/${pack.name}/app/fonts`,
  );

  console.log(`Downloading ${fontConfig.name} font`);

  const fontDownloadPaths = _.values(_.omit(fontConfig, ['name', 'default']));
  const fontFileNames = _.map(
    fontDownloadPaths,
    fontUrl => /[^/]*$/.exec(fontUrl)[0],
  );
  const downloadPromises = _.map(fontDownloadPaths, fontUrl => {
    const fileName = /[^/]*$/.exec(fontUrl)[0];
    const filePath = path.resolve(fontsDir, fileName);

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

      execSync(fontRenameCommand, { cwd: fontsDir });
    })
    .catch(() => {
      const errorMessage = `Downloading ${fontConfig.name} FAILED`.bold.red;
      throw errorMessage;
    });
}

// Removes automatic UI lib linking, causing conflict with duplicate fonts
function removeUiLinking() {
  const themeExtDir = path.resolve(projectPath, `extensions/shoutem.theme`);
  const uiFontsDir = path.resolve(
    projectPath,
    `node_modules/@shoutem/ui/fonts`,
  );
  const rnConfigFilePath = path.resolve(
    projectPath,
    `node_modules/@shoutem/ui/react-native.config.js`,
  );

  console.log('Ensuring default fonts from @shoutem/ui are unlinked');

  if (fs.existsSync(themeExtDir) && fs.readdirSync(uiFontsDir).length > 0) {
    fs.emptyDirSync(uiFontsDir);
  }

  if (fs.existsSync(rnConfigFilePath)) {
    fs.unlinkSync(rnConfigFilePath);
  }
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

  removeUiLinking();
  Promise.all(fontsToDownload)
    .then(() => console.log('Font download complete'))
    .catch(e => {
      throw new Error(e);
    });
}

module.exports = {
  downloadFonts,
};
