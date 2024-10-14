
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('SesionCita', 'fid_tipoModalidad', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'TipoModalidad', // Nombre de la tabla referenciada
        key: 'id_tipoModalidad' // Llave primaria de la tabla referenciada
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('SesionCita', 'fid_tipoModalidad');
  }
};

