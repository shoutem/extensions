const _ = require('lodash');
const fs = require('fs-extra');

const buildTools = require('shoutem.application/build');

const { downloadFile, writeFile, writeJsonToFile } = buildTools.files;
const { getExtensionSettings } = buildTools.configuration;

const { getAppConfiguration } = require('@shoutem/build-tools');

function preBuild(appConfiguration) {
  // TODO: allow imports in preBuild scripts, so that we can import const.js here
  const settings = getExtensionSettings(appConfiguration, 'shoutem.i18n');
  const translations = _.get(settings, 'translations', {});
  const shortcutTranslations = _.get(settings, 'shortcuts', {});
  const translationFilePromises = [];
  const customLanguages = [];

  // Download all translations configured on the server, and same them locally
  for (const language of _.keys(translations)) {
    const languageFileName = `${language}.json`;
    const filePath = `${process.cwd()}/translations/${languageFileName}`;
    const promise = downloadFile(translations[language], filePath).then(() => {
      const translationObject = fs.readJsonSync(filePath, 'utf8');

      const shortcuts = _.reduce(
        _.keys(shortcutTranslations),
        (result, shortcut) => {
          const value = shortcutTranslations[shortcut][language];

          if (_.isEmpty(value)) {
            return result;
          }

          return _.merge({}, result, {
            [shortcut]: value,
          });
        },
        {},
      );

      const resolvedTranslation = _.merge({}, translationObject, {
        shoutem: {
          navigation: {
            shortcuts,
          },
        },
      });

      writeJsonToFile(filePath, resolvedTranslation);
    });

    customLanguages.push(
      `  '${language}': require('./${languageFileName}'),\n`,
    );
    translationFilePromises.push(promise);
  }

  // Generate the js file so that we know can load those files during runtime
  console.log('Creating translations index.js');
  const languagesIndex = `export default {\n${customLanguages.join('')}};\n`;
  writeFile('translations/index.js', languagesIndex);

  return Promise.all(translationFilePromises).catch(err => {
    process.exitCode = 1;
    throw new Error(`Failed to download language file: ${err}`);
  });
}

function runPreBuild() {
  const appConfiguration = getAppConfiguration();
  preBuild(appConfiguration);
}

module.exports = {
  preBuild,
  runPreBuild,
};
