'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('CompromisoCita', 'fid_sesionCita', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'SesionCita', // nombre de la tabla de la clave foránea
        key: 'id_cita', // clave primaria de la tabla foránea
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('CompromisoCita', 'fid_sesionCita');
  }
};
