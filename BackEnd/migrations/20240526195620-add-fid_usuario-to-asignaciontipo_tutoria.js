'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('AsignacionTipoTutoria', 'fid_tutor', 'fid_usuario');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('AsignacionTipoTutoria', 'fid_usuario', 'fid_tutor');
  }
};