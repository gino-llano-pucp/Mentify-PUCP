'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AsignacionTutorAlumno', {
      id_asignacionTutorAlumno: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fid_alumno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_tutor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_tipoTutoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TipoTutoria',
          key: 'id_tipoTutoria'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_solicitud: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'SolicitudTutorFijo',
          key: 'id_solicitud'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('AsignacionTutorAlumno');
  }
};
