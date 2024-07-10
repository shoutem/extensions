'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Apps', {
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
      iosBinaryVersionName: {
        type: Sequelize.STRING
      },
      iosBinaryVersionCode: {
        type: Sequelize.INTEGER
      },
      iosBundleVersionCode: {
        type: Sequelize.INTEGER
      },
      iosBundleUrl: {
        type: Sequelize.STRING
      },
      androidBinaryVersionName: {
        type: Sequelize.STRING
      },
      androidBinaryVersionCode: {
        type: Sequelize.INTEGER
      },
      androidBundleVersionCode: {
        type: Sequelize.INTEGER
      },
      androidBundleUrl: {
        type: Sequelize.STRING
      },
      previewIosBundleUrl: {
        type: Sequelize.STRING
      },
      previewAndroidBundleUrl: {
        type: Sequelize.STRING
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
    return queryInterface.dropTable('Apps');
  }
};