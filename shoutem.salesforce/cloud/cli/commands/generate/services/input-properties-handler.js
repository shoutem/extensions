import inquirer from 'inquirer';
import sequelize from 'sequelize';
import _ from 'lodash';

const dataTypes = _.keys(sequelize.DataTypes.postgres);

export async function getProperties() {
  const properties = [];
  while (true) {
    const propertyName = await inquirer.prompt([{ name: 'name', message: 'Enter property name' }]);
    if (propertyName.name === '') {
      break;
    }
    const propertyType = await inquirer.prompt([{
      name: 'type',
      type: 'list',
      message: 'Select property type',
      choices: dataTypes,
    }]);
    properties.push({ name: propertyName.name, type: propertyType.type });
  }
  return properties;
}
