const fs = require('fs-extra');
const _ = require('lodash');
const path = require('path');
const { projectPath } = require('@shoutem/build-tools');

const MAIN_THEME_FILE_LOCATION = path.resolve(
  projectPath,
  'extensions/shoutem.rubicon-theme/app/themes/extensionThemes.js',
);

function composeTheme(appConfiguration) {
  const installedExtensions = _.get(
    appConfiguration,
    'data.relationships.extensions.data',
    [],
  );

  _.forEach(installedExtensions, async extension => {
    const extensionName = extension?.id;
    const themePath = path.resolve(
      projectPath,
      `extensions/${extensionName}/app/themes/style.js`,
    );

    try {
      fs.accessSync(themePath);
    } catch (_e) {
      return;
    }

    const searchString = 'const extensionThemes = {';
    const newImportString = `const extensionThemes = {\n\t'${extensionName}': require('../../../${extensionName}/app/themes/style.js'),\n`;
    const existingConfig = fs.readFileSync(MAIN_THEME_FILE_LOCATION, 'utf8');
    const newConfig = existingConfig.replace(searchString, newImportString);
    fs.writeFileSync(MAIN_THEME_FILE_LOCATION, newConfig);

    console.log(
      `[shoutem.rubicon-theme] - Added theme styling from ${extensionName}`,
    );
  });
}

module.exports = {
  composeTheme,
};
