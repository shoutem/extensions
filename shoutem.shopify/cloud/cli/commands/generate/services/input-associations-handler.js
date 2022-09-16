import inquirer from 'inquirer';
import _ from 'lodash';
import models from '../../../../src/sequelize/models/index';
import changeCase from 'change-case';

const modelTypes = _.keys(models);
modelTypes.push('CUSTOM(enter name in next line)');
const associationTypes = ['BelongsTo', 'BelongsToMany', 'HasOne', 'HasMany'];

export async function getAssociations() {
  const associations = [];
  const foreignKeys = [];
  while (true) {
    const associationName = await inquirer.prompt([{ name: 'name', message: 'Enter association name' }]);
    if (associationName.name === '') {
      break;
    }

    const associationType = await inquirer.prompt([
      {
        name: 'type',
        type: 'list',
        message: 'Select association type',
        choices: associationTypes,
      },
    ]);

    const relatedModelGetter = await inquirer.prompt([
      {
        name: 'model',
        type: 'list',
        message: 'Select related model',
        choices: modelTypes,
      },
    ]);

    if (relatedModelGetter.model === 'CUSTOM(enter name in next line)') {
      const modelName = await inquirer.prompt([{ name: 'name', message: 'Enter related model name' }]);
      relatedModelGetter.model = modelName.name;
    }

    const ioType = changeCase.constantCase(relatedModelGetter.model) + '_TYPE';
    let swaggerTypeRelationship = relatedModelGetter.model;
    let jsType = relatedModelGetter.model;
    if (_.endsWith(associationType.type, 'Many')) {
      jsType = jsType + '[]';
      swaggerTypeRelationship = swaggerTypeRelationship + 'CollectionRelationship';
    } else {
      swaggerTypeRelationship = swaggerTypeRelationship + 'SingleRelationship';
    }

    if (associationType.type === 'BelongsToMany') {
      const throughModel = await inquirer.prompt([
        {
          name: 'through',
          type: 'list',
          message: 'Select through model',
          choices: modelTypes,
        },
      ]);

      if (throughModel.through === 'CUSTOM(enter name in next line)') {
        const modelName = await inquirer.prompt([{ name: 'name', message: 'Enter through model name' }]);
        throughModel.through = modelName.name;
      }

      relatedModelGetter.model = relatedModelGetter.model + ', () => ' + throughModel.through;
    }

    let alternativeKey;
    if (associationType.type === 'BelongsTo') {
      alternativeKey = `alternativeKey: ${associationName.name}Id`;
      const model = relatedModelGetter.model;
      foreignKeys.push({
        name: associationName.name + 'Id',
        model,
        typeModuleName: _.lowerCase(model),
        ioType,
      });
    }

    associations.push({
      name: associationName.name,
      associationType: associationType.type,
      relatedModelGetter: relatedModelGetter.model,
      jsType,
      ioType,
      relatedModuleName: _.lowerCase(relatedModelGetter.model),
      swaggerTypeRelationship,
      alternativeKey,
    });
  }
  return { associations, foreignKeys };
}
