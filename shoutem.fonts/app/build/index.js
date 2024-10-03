const { getAppConfiguration } = require('@shoutem/build-tools');
const { downloadFonts } = require('./downloadFonts');
const { injectFontImportCode } = require('./injectFontImportCode');

function preBuild(appConfiguration) {
  downloadFonts(appConfiguration);
}

function previewBuild(appConfiguration) {
  downloadFonts(appConfiguration).then(injectFontImportCode);
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  previewBuild,
  runPreBuild,
};
