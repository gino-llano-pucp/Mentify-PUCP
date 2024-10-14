'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Opcion', {
      id_opcion: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fid_pregunta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Pregunta',
          key: 'id_pregunta'
        }
      },
      descripcion: {
        type: Sequelize.STRING,
        allowNull: false
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    await queryInterface.dropTable('Opcion');
  }
};
