'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('AlumnoSesionCita', 'fechaCreacion', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('AlumnoSesionCita', 'fechaActualizacion', {
      type: Sequelize.DATE,
      allowNull: true,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('AlumnoSesionCita', 'fechaCreacion');
    await queryInterface.removeColumn('AlumnoSesionCita', 'fechaActualizacion');
  }
};