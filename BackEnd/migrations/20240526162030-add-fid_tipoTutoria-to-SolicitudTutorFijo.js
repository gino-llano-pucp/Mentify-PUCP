'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('SolicitudTutorFijo', 'fid_tipoTutoria', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('SolicitudTutorFijo', 'fid_tipoTutoria');
  }
};
