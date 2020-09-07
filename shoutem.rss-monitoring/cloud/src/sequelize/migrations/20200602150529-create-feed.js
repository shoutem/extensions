'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Feeds', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      feedKey: {
        allowNull: false,
        type: Sequelize.STRING,
      },
      lastFeedItemHash: {
        type: Sequelize.STRING,
      },
      monitorId: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Monitors',
          key: 'id',
        },
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Feeds');
  },
};
