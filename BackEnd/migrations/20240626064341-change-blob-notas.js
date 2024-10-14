'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.changeColumn("HistoricoEstudiante", "nota", {
      type: Sequelize.BLOB("long"),
      allowNull: true,
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.changeColumn("HistoricoEstudiante", "nota", {
      type: Sequelize.BLOB,
      allowNull: true,
    });
  }
};
