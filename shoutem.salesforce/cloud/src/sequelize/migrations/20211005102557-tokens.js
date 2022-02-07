'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Tokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      appId: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      access_token: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      refresh_token: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      expires_in: {
        allowNull: true,
        type: Sequelize.INTEGER
      },
      token_type: {
        allowNull: true,
        type: Sequelize.STRING
      },
      rest_instance_url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      soap_instance_url: {
        allowNull: true,
        type: Sequelize.STRING
      },
      scope: {
        allowNull: true,
        type: Sequelize.TEXT
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Tokens');
  }
};
