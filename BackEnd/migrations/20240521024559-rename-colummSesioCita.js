'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.renameColumn('SesionCita', 'fid_tipo_tutoria', 'fid_tipoTutoria');
    await queryInterface.removeColumn('SesionCita', 'fid_tipo_modalidad');
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.renameColumn('SesionCita', 'fid_tipoTutoria', 'fid_tipo_tutoria');
    await queryInterface.addColumn('SesionCita', 'fid_tipo_modalidad', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
