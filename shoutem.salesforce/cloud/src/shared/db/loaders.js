import Sequelize from 'sequelize-values';
import changeCase from 'change-case';

const sequelize = new Sequelize();

export function loadModel(Model) {
  return async (id) => {
    if (!id) {
      return null;
    }

    const object = await Model.findByPk(id);
    return sequelize.getValues(object);
  };
}

export function loadModelAssociation(Model, associationName) {
  return async (object) => {
    const dbObject = await Model.findByPk(object.id, { paranoid: false });
    const associationFnName = `get${changeCase.pascalCase(associationName)}`;
    const association = await dbObject[associationFnName].bind(dbObject)();
    return sequelize.getValues(association);
  };
}
