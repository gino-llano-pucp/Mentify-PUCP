'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('TipoTutoria', 'fid_programa', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Programa',
        key: 'id_programa'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('TipoTutoria', 'fid_programa');
  }
};
