'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('AsignacionTipoTutoria', {
      id_asignacionTipoTutoria: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fid_tutor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario', // Asegúrate de que el nombre del modelo sea el correcto
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_tipoTutoria: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'TipoTutoria', // Asegúrate de que el nombre del modelo sea el correcto
          key: 'id_tipoTutoria'
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
    // Eliminar la tabla AsignacionTipoTutoria
    await queryInterface.dropTable('AsignacionTipoTutoria');
  }
};
