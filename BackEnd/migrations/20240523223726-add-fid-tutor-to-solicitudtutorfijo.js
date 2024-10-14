'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Agregar la columna 'fid_tutor'
    await queryInterface.addColumn('SolicitudTutorFijo', 'fid_tutor', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario', // 
        key: 'id_usuario' // 
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE' // Elige 'CASCADE' o 'SET NULL' según la política de integridad referencial deseada
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar la columna 'fid_tutor'
    await queryInterface.removeColumn('SolicitudTutorFijo', 'fid_tutor');
  }
};

