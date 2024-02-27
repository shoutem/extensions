'use strict';

const indexName = 'feeds_monitor_id_index';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addIndex('Feeds', {
      name: indexName,
      fields: ['monitorId'],
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeIndex('Feeds', indexName);
  },
};
