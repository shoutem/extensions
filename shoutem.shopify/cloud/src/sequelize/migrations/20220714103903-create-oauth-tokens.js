'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('OAuthTokens', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      access_token: {
        allowNull: false,
        type: Sequelize.TEXT
      },
      shop: {
        allowNull: false,
        unique: true,
        type: Sequelize.STRING
      },
      scope: {
        allowNull: true,
        type: Sequelize.TEXT
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('OAuthTokens');
  }
};
