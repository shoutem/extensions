const _ = require('lodash');

const buildTools = require('shoutem.application/build');

const { downloadFile, writeFile } = buildTools.files;
const { getExtensionSettings } = buildTools.configuration;

exports.preBuild = function preBuild(appConfiguration) {
  // TODO: allow imports in preBuild scripts, so that we can import const.js here
  const settings = getExtensionSettings(appConfiguration, 'shoutem.i18n');
  const translations = _.get(settings, 'translations', {});
  const translationFilePromises = [];
  const customLanguages = [];

  // Download all translations configured on the server, and same them locally
  for (const language of _.keys(translations)) {
    const languageFileName = `${language}.json`;
    const promise = downloadFile(translations[language], `${process.cwd()}/translations/${languageFileName}`);
    customLanguages.push(`  '${language}': require('./${languageFileName}'),\n`);
    translationFilePromises.push(promise);
  }

  // Generate the js file so that we know can load those files during runtime
  console.log('Creating translations index.js');
  const languagesIndex = `export default {\n${customLanguages.join('')}};\n`;
  writeFile('translations/index.js', languagesIndex);

  return Promise.all(translationFilePromises)
    .catch((err) => {
      process.exitCode = 1;
      throw new Error(`Failed to download language file: ${err}`);
    });
};
