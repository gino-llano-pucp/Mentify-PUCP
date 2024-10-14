'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Programa', {
      id_programa: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: true
      },
      fid_usuario: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        }
      },
      esActivo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        allowNull: true,
        type: Sequelize.DATE
      },
      fechaActualizacion: {
        allowNull: true,
        type: Sequelize.DATE
      },
      fid_facultad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Facultad',
          key: 'id_facultad'
        }
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Programa');
  }
};
