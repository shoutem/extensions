'use strict';

const indexName = 'apps_app_id_index';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Apps', {
      name: indexName,
      fields: ['appId'],
      unique: true
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('Apps', indexName);
  }
};
