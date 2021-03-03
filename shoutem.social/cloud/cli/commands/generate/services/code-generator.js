import _ from 'lodash';
import path from 'path';
import pluralize from 'pluralize';
import scaffander from 'scaffander';
import fs from 'fs';
import changeCase from 'change-case';
import { execSync } from 'child_process';

const rootPath = '../../../..';
const srcPath = path.join(rootPath, 'src');
const templatePath = path.join(__dirname, rootPath, 'template', '/{=moduleName=}');
const destinationPath = path.join(__dirname, srcPath);

export const postgresSwaggerTypesMap = {
  DECIMAL: 'number',
  INTEGER: 'number',
  BOOLEAN: 'boolean',
  BIGINT: 'number',
  REAL: 'number',
  FLOAT: 'number',
  'DOUBLE PRECISION': 'number',
};

export const sequelizeJsTypesMap = {
  DECIMAL: 'number',
  INTEGER: 'number',
  BOOLEAN: 'boolean',
  BIGINT: 'number',
  REAL: 'number',
  FLOAT: 'number',
  'DOUBLE PRECISION': 'number',
};

const getTemplateFiles = (dir, fileList = []) => {
  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    if (fs.statSync(path.join(dir, file)).isDirectory()) {
      fileList = getTemplateFiles(path.join(dir, file), fileList);
    } else {
      fileList.push(path.join(dir, file));
    }
  });
  return fileList;
};

export async function generateModule(context) {
  for (const property of context.properties) {
    property.swaggerType = postgresSwaggerTypesMap[property.type] || 'string';
    property.jsType = sequelizeJsTypesMap[property.type] || 'string';
    property.sequelizeType = property.type;
  }

  context.moduleName = changeCase.paramCase(context.modelName);
  context.modelName = {
    upperCase: changeCase.upperCaseFirst(context.modelName),
    camelCase: changeCase.camelCase(context.modelName),
    paramCase: changeCase.paramCase(context.modelName),
    pascalCase: changeCase.pascalCase(context.modelName),
    noCase: changeCase.noCase(context.modelName),
    noCasePlural: pluralize.plural(changeCase.noCase(context.modelName)),
    pascalCasePlural: pluralize.plural(changeCase.pascalCase(context.modelName)),
    paramCasePlural: pluralize.plural(changeCase.paramCase(context.modelName)),
    titleCase: changeCase.titleCase(context.modelName),
    constantCase: changeCase.constantCase(context.modelName),
  };

  let resolvedTemplatePath = templatePath;
  let resolvedDestinationPath = destinationPath;
  if (context.onlyDocs) {
    resolvedTemplatePath = path.join(resolvedTemplatePath, 'docs');
    resolvedDestinationPath = path.join(resolvedDestinationPath, context.moduleName);
  }

  // console.log(`Properties: ${JSON.stringify(context.properties)}`);
  // console.log(`Associations: ${JSON.stringify(context.associations)}`);
  // console.log(`Foreign keys: ${JSON.stringify(context.foreignKeys)}`);

  await scaffander(resolvedTemplatePath, resolvedDestinationPath, context, {
    msg: 'Do you want to apply these changes?',
    tags: ['{=', '=}'],
    // fileExtension: 'ts',
  });

  if (context.onlyDocs) {
    return;
  }

  if (_.size(context.foreignKeys) > 0) {
    console.warn('WARNING Foreign key references currently not generated. Add manually. Example:\n');
    console.warn(`zooId: {
      type: Sequelize.INTEGER,
        references: {
          model: 'Zoos',
          key: 'id',
        },
      },`);
  }

  let sequelizeAttributes = _.map(context.properties, (p) => `${p.name}:${p.type}`).join(',');
  sequelizeAttributes = sequelizeAttributes + _.map(context.foreignKeys, (k) => `,${k.name}:INTEGER`).join();

  const sequelizeCommand = `${path.join(__dirname, '../../../../node_modules/.bin/sequelize ')} model:generate --name ${
    context.modelName.upperCase
  } --attributes ${sequelizeAttributes}`;
  execSync(sequelizeCommand);

  const modelPath = `${path.join(__dirname, '../../../../src/sequelize/models/')}${context.modelName.noCase}.js`;

  // deleting sequelize model file because it is created by our own scaffolding tool
  fs.unlinkSync(modelPath);
}
