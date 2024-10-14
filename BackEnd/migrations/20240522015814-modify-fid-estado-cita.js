'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    // Cambiar la columna para hacerla no nula
    await queryInterface.changeColumn('SesionCita', 'fid_estado_cita', {
      type: Sequelize.INTEGER,
      allowNull: false,  // Hacer la columna no nula
      references: {
        model: 'EstadoCita', // Nombre del modelo debe coincidir con la tabla de base de datos
        key: 'id_estado_cita'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'  // Asegúrate de que este comportamiento es el deseado
    });
  },

  async down(queryInterface, Sequelize) {
    // Revertir a la configuración original si es necesario
    await queryInterface.changeColumn('SesionCita', 'fid_estado_cita', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'EstadoCita',
        key: 'id_estado_cita'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  }
};