'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Add the foreign key constraint for fid_resultado in SesionCita table
    await queryInterface.addConstraint('SesionCita', {
      fields: ['fid_resultado'],
      type: 'foreign key',
      name: 'fk_sesion_cita_resultado',
      references: {
        table: 'ResultadoCita',
        field: 'id_resultado'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('SesionCita', 'fk_sesion_cita_resultado');
  }
};

