'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Pregunta', {
      id_pregunta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fid_encuesta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Encuesta', // nombre de la tabla referenciada
          key: 'id_encuesta'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      enunciado: {
        type: Sequelize.STRING,
        allowNull: false
      },
      es_rpta_unica: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Pregunta');
  }
};
