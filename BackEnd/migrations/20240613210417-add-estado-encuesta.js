'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('EstadoEncuesta', {
      id_estado_encuesta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: true
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true
      }
    });

    // Insertar estados por defecto
    await queryInterface.bulkInsert('EstadoEncuesta', [
      {
        nombre: 'Pendiente',
        descripcion: 'Encuesta pendiente de respuesta',
        esActivo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        nombre: 'Respondido',
        descripcion: 'Encuesta respondida',
        esActivo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('EstadoEncuesta');
  }
};
