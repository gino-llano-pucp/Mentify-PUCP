'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Audit', 'performedBy', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('Audit', 'performedBy', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  }
};