'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.dropTable("Encuesta");
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.createTable("Encuesta", {
      id_encuesta: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fid_alumno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuario", // nombre de la tabla relacionada
          key: "id_usuario",
        },
      },
      fid_coord: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "Usuario", // nombre de la tabla relacionada
          key: "id_usuario",
        },
      },
      fid_estado_encuesta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "EstadoEncuesta", // nombre de la tabla relacionada
          key: "id_estado_encuesta",
        },
      },
      titulo: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      fechaEnvio: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  }
};
