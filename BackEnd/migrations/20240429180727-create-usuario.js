'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Usuario', {
      id_usuario: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nombres: {
        type: Sequelize.STRING,
        allowNull: false
      },
      primerApellido: {
        type: Sequelize.STRING,
        allowNull: false
      },
      segundoApellido: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      contrasenha: {
        type: Sequelize.STRING,
        allowNull: false
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true,
        allowNull: false
      },
      codigo: {
        type: Sequelize.STRING(8),
        allowNull: true
      },
      imagen: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fechaCreacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechaActualizacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Usuario');
  }
};