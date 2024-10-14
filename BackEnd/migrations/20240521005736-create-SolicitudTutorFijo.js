'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SolicitudTutorFijo', {
      id_solicitud: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fid_alumno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario', // Asegúrate de que este sea el nombre correcto de la tabla
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      esRechazado: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      motivoRechazo: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fid_estadoSolicitud: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'EstadoSolicitudTutorFijo',
          key: 'id_estadoSolicitud'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fechaRegistro: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechaCierre: {
        type: Sequelize.DATE,
        allowNull: true
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
    await queryInterface.dropTable('SolicitudTutorFijo');
  }
};
