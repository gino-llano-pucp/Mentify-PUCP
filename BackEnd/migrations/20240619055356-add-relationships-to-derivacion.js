'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Adding foreign key constraint to fid_alumno
    await queryInterface.addConstraint('Derivacion', {
      fields: ['fid_alumno'],
      type: 'foreign key',

      references: {
        table: 'Usuario', // the referenced table name
        field: 'id_usuario' // the referenced column name
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Adding foreign key constraint to fid_cita
    await queryInterface.addConstraint('Derivacion', {
      fields: ['fid_cita'],
      type: 'foreign key',

      references: {
        table: 'SesionCita', // the referenced table name
        field: 'id_cita' // the referenced column name
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Adding foreign key constraint to fid_tutor
    await queryInterface.addConstraint('Derivacion', {
      fields: ['fid_tutor'],
      type: 'foreign key',

      references: {
        table: 'Usuario', // the referenced table name
        field: 'id_usuario' // the referenced column name
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Adding foreign key constraint to fid_unidad_academica
    await queryInterface.addConstraint('Derivacion', {
      fields: ['fid_unidad_academica'],
      type: 'foreign key',
 
      references: {
        table: 'UnidadAcademica', // the referenced table name
        field: 'id_unidad_academica' // the referenced column name
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    // Adding foreign key constraint to fid_tipoTutoria
    await queryInterface.addConstraint('Derivacion', {
      fields: ['fid_tipoTutoria'],
      type: 'foreign key',

      references: {
        table: 'TipoTutoria', // the referenced table name
        field: 'id_tipoTutoria' // the referenced column name
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Removing foreign key constraint from fid_alumno
    await queryInterface.removeConstraint('Derivacion', 'fk_derivacion_alumno');

    // Removing foreign key constraint from fid_cita
    await queryInterface.removeConstraint('Derivacion', 'fk_derivacion_cita');

    // Removing foreign key constraint from fid_tutor
    await queryInterface.removeConstraint('Derivacion', 'fk_derivacion_tutor');

    // Removing foreign key constraint from fid_unidad_academica
    await queryInterface.removeConstraint('Derivacion', 'fk_derivacion_unidad_academica');

    // Removing foreign key constraint from fid_tipoTutoria
    await queryInterface.removeConstraint('Derivacion', 'fk_derivacion_tipoTutoria');
  }
};
