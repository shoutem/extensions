'use strict';

const tableName = 'Feeds';
const constraintName = 'Feeds_monitorId_fkey';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    try {
      await queryInterface.removeConstraint(tableName, constraintName);
    } catch (error) {
      if (error.name !== 'SequelizeUnknownConstraintError') {
        throw error;
      }
    }

    return queryInterface.addConstraint(tableName, {
      fields: ['monitorId'],
      type: 'foreign key',
      name: constraintName,
      references: {
        table: 'Monitors',
        field: 'id',
      },
      onDelete: 'cascade',
      onUpdate: 'cascade',
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeConstraint(tableName, constraintName);
  },
};
