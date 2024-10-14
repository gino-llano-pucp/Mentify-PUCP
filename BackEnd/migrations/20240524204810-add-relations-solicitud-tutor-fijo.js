'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('AsignacionTutorAlumno', {
      fields: ['fid_solicitud'],
      type: 'foreign key',
      name: 'fk_asignacionTutorAlumno_solicitud', // Nombre de la restricción
      references: {
        table: 'SolicitudTutorFijo',
        field: 'id_solicitud'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('AsignacionTutorAlumno', 'fk_asignacionTutorAlumno_solicitud');
  }
};
