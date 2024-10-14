'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Encuesta', 'fid_estado_encuesta', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'EstadoEncuesta',
        key: 'id_estado_encuesta'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Encuesta', 'fid_estado_encuesta');
  }
};
