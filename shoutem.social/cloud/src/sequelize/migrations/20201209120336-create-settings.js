'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.STRING
      },
      commentsOnMyStatuses: {
        type: Sequelize.BOOLEAN
      },
      likesOnMyStatuses: {
        type: Sequelize.BOOLEAN
      },
      commentsOnCommentedStatuses: {
        type: Sequelize.BOOLEAN
      },
      commentsOnLikedStatuses: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Settings');
  }
};
