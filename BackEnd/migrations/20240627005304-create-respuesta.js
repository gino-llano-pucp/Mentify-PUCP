'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Respuesta', {
      id_respuesta: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fid_encuesta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Encuesta',
          key: 'id_encuesta'
        }
      },
      fid_pregunta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pregunta',
          key: 'id_pregunta'
        }
      },
      fid_opcion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Opcion',
          key: 'id_opcion'
        }
      },
      fechaCreacion: {
        type: Sequelize.DATE
      },
      fechaActualizacion: {
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Respuesta');
  }
};
