'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Crear tabla SesionCita
    await queryInterface.createTable('SesionCita', {
      id_sesion_cita: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fecha_hora: {
        type: Sequelize.DATE,
        allowNull: false
      },
      id_estado_cita: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {           // Clave foránea hacia EstadoCita
          model: 'EstadoCita',
          key: 'id_estado_cita'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      }
    });
  },

  async down(queryInterface, Sequelize) {
    // Eliminar tabla SesionCita
    await queryInterface.dropTable('SesionCita');
  }
};