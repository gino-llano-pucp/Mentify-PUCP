'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Audit');

    if (!tableDefinition.performedBy) {
      await queryInterface.addColumn('Audit', 'performedBy', {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    const tableDefinition = await queryInterface.describeTable('Audit');

    if (tableDefinition.performedBy) {
      await queryInterface.removeColumn('Audit', 'performedBy');
    }
  }
};
