import _ from 'lodash';
import Sequelize from 'sequelize-values';

const sequelize = new Sequelize();

export function lean(target, name, descriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args) {
    const result = await method.apply(this, args);
    return sequelize.getValues(result);
  };

  return descriptor;
}

export function leanPage(target, name, descriptor) {
  const method = descriptor.value;

  descriptor.value = async function (...args) {
    const result = await method.apply(this, args);
    return _.set(result, '_pageItems', sequelize.getValues(_.get(result, '_pageItems')));
  };

  return descriptor;
}
