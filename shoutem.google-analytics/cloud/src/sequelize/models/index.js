import path from 'path';
import _ from 'lodash';
import glob from 'glob';
import database from '../../shared/db/database';

const models = {};
const modelsArray = [];
const sequelize = database.getInstance();

const modelExtension = 'ts';
glob.sync(`src/*/data/*-model.${modelExtension}`).forEach((file) => {
  const model = require(path.join(__dirname, '../../../', file)).default;
  models[model.name] = model;
  modelsArray.push(model);
});

_.each(models, model => {
  if (model.associate) {
    model.associate(models);
  }
});

sequelize.addModels(modelsArray);

export default models;
