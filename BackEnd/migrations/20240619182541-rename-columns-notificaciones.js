'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar columnas antiguas
    await queryInterface.removeColumn('Notificaciones', 'createdAt');
    await queryInterface.removeColumn('Notificaciones', 'updatedAt');

    // Crear nuevas columnas
    await queryInterface.addColumn('Notificaciones', 'fechaCreacion', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('Notificaciones', 'fechaActualizacion', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar las nuevas columnas
    await queryInterface.removeColumn('Notificaciones', 'fechaCreacion');
    await queryInterface.removeColumn('Notificaciones', 'fechaActualizacion');

    // Recrear las columnas antiguas
    await queryInterface.addColumn('Notificaciones', 'createdAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    });
    await queryInterface.addColumn('Notificaciones', 'updatedAt', {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
    });
  }
};
