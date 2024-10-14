'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('UnidadAcademica', {
      id_unidad_academica: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      siglas: {
        type: Sequelize.STRING(20), // Length based on expected data
        allowNull: false
      },
      correoDeContacto: {
        type: Sequelize.STRING(100),
        allowNull: false
      },
      esActivo: {
        type: Sequelize.TINYINT,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('UnidadAcademica');
  }
};
