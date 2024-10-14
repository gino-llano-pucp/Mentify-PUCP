'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuario', 'fid_programa', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Programa',  // Nombre de la tabla de destino
        key: 'id_programa'  // Clave primaria de la tabla de destino
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuario', 'fid_programa');
  }
};
