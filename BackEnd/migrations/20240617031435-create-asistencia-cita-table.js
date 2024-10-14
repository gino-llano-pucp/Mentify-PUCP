'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('AsistenciaCita', {
      id_asistencia: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fid_sesionCita: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'SesionCita',
          key: 'id_cita'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_alumno: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'Usuario', // Asegúrate de que esta es la tabla correcta para usuarios
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      asistio: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('AsistenciaCita');
  }
};
