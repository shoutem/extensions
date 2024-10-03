/* eslint-disable no-console */
require('colors');
const _ = require('lodash');
const path = require('path');
const { projectPath } = require('@shoutem/build-tools');
const pack = require('../package.json');
const { ANCHORS, inject } = require('@shoutem/build-tools');

const WEB_INDEX_FILE = path.resolve(projectPath, `index.web.js`);
const FONT_ASSET_DIR = path.resolve(
  projectPath,
  `extensions/${pack.name}/app/fonts`,
);

function extractFontFileNames(downloadedFonts) {
  const fontUrls = _.compact(
    _.reduce(
      downloadedFonts,
      (result, downloadedFont) => {
        const {
          fileUrl,
          boldFileUrl,
          italicFileUrl,
          boldItalicFileUrl,
        } = downloadedFont.attributes;

        result.push(fileUrl, boldFileUrl, italicFileUrl, boldItalicFileUrl);
        return result;
      },
      [],
    ),
  );

  return _.map(fontUrls, url => path.basename(url));
}

function generateFontInjectionCode(fontFileNames) {
  const importStatements = [];
  const fontStyleDeclarations = [];
  const stylesheetFontDeclarations = [];

  fontFileNames.forEach(fontUrl => {
    // Extract the base name of the font without extension
    const extname = path.extname(fontUrl).toLowerCase();
    const baseName = fontUrl.replace(/\.(ttf|otf)$/, '');
    // Generate the variable name by removing non-alphanumeric characters
    const variableName = baseName.replace(/[^a-zA-Z0-9]/g, '');
    // Generate the import statement
    importStatements.push(
      `import ${variableName} from '${FONT_ASSET_DIR}/${baseName}${extname}';`,
    );

    // Generate the font-face style name with the first character lowercased
    const styleName =
      variableName.charAt(0).toLowerCase() + variableName.slice(1);

    // Generate the font-face declaration
    const fontStyleDeclaration = `const ${styleName}FontStyle = \`@font-face {
      src: url(\${${variableName}});
      font-family: '${baseName}';
    }\`;`;

    fontStyleDeclarations.push(fontStyleDeclaration);

    stylesheetFontDeclarations.push(
      `style.appendChild(document.createTextNode(${styleName}FontStyle));`,
    );
  });

  const createStylesheet = `// Create stylesheet\nconst style = document.createElement('style');\nstyle.type = 'text/css';`;
  const injectStylesheet = `// Inject stylesheet\ndocument.head.appendChild(style);`;

  return {
    imports: importStatements.join('\n'),
    createStylesheet,
    injectStylesheet,
    fontStyles: fontStyleDeclarations.join('\n\n'),
    appendFontStyles: stylesheetFontDeclarations.join('\n'),
  };
}

async function injectFontImportCode(downloadedFonts) {
  const fontFileNames = extractFontFileNames(downloadedFonts);

  const {
    imports,
    fontStyles,
    createStylesheet,
    appendFontStyles,
    injectStylesheet,
  } = generateFontInjectionCode(fontFileNames);

  try {
    inject(WEB_INDEX_FILE, ANCHORS.WEB.FONT_IMPORTS, imports);
    inject(WEB_INDEX_FILE, ANCHORS.WEB.FONT_STYLES, fontStyles);
    inject(WEB_INDEX_FILE, ANCHORS.WEB.CREATE_STYLESHEET, createStylesheet);
    inject(WEB_INDEX_FILE, ANCHORS.WEB.APPEND_FONT_STYLES, appendFontStyles);
    inject(WEB_INDEX_FILE, ANCHORS.WEB.INJECT_STYLESHEET, injectStylesheet);
    console.log('Font injection done'.bold.green);
  } catch (e) {
    console.log('Something went wrong'.bold.red);
  }
}

module.exports = {
  injectFontImportCode,
};
