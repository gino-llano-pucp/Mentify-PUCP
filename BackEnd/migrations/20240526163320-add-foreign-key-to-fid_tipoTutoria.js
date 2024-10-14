'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('SolicitudTutorFijo', 'fid_tipoTutoria', {
      type: Sequelize.INTEGER,
      allowNull: false,  // No permitir nulo después de asegurar los datos existentes
      references: {
        model: 'TipoTutoria',
        key: 'id_tipoTutoria'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('SolicitudTutorFijo', 'fid_tipoTutoria', {
      type: Sequelize.INTEGER,
      allowNull: true
    });
  }
};
