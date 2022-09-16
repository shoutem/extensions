'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('StorefrontTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      shop: {
        allowNull: false,
        type: Sequelize.STRING
      },
      access_token: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      access_scope: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      created_at: {
        type: Sequelize.DATE
      },
      external_id: {
        allowNull: false,
        type: Sequelize.BIGINT
      },
      admin_graphql_api_id: {
        type: Sequelize.TEXT
      },
      title: {
        type: Sequelize.STRING
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('StorefrontTokens');
  }
};
