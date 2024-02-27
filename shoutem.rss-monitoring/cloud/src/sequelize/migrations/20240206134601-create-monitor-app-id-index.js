'use strict';

const indexName = 'monitors_app_id_index';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Monitors', {
      name: indexName,
      fields: ['appId'],
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('Monitors', indexName);
  },
};
