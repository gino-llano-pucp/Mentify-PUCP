'use strict';

const { sequelize } = require('../models');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Rol', {
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {        
        type: Sequelize.STRING,
        allowNull: false
      },
      es_activo: {
        type: Sequelize.TINYINT,
        allowNull: true,
        defaultValue: true
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
  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Rol');
  }
};
