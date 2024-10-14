'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Eliminar columnas innecesarias
    await queryInterface.removeColumn('Notificaciones', 'titulo');
    await queryInterface.removeColumn('Notificaciones', 'mensaje');
    await queryInterface.removeColumn('Notificaciones', 'fechaHora');
  },

  async down(queryInterface, Sequelize) {
    // Recrear columnas en caso de revertir la migración
    await queryInterface.addColumn('Notificaciones', 'titulo', {
      type: Sequelize.STRING,
      allowNull: false
    });
    await queryInterface.addColumn('Notificaciones', 'mensaje', {
      type: Sequelize.TEXT,
      allowNull: false
    });
    await queryInterface.addColumn('Notificaciones', 'fechaHora', {
      type: Sequelize.DATE,
      allowNull: false
    });
  }
};
