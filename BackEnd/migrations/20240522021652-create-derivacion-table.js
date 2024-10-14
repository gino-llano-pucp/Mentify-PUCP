'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Derivacion', {
      id_derivacion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      fid_tutor: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fid_alumno: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      documento: {
        type: Sequelize.BLOB,
        allowNull: true
      },
      observaciones: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fid_unidad_academica: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      fecha_derivacion: {
        type: Sequelize.DATE,
        allowNull: false
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
      },
      es_activo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Derivacion');
  }
};