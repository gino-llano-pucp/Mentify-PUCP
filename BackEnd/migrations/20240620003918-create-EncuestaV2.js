'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
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
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fid_estado_Encuesta: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "EstadoEncuesta", // nombre de la tabla relacionada
          key: "id_estado_encuesta",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fid_encuesta_Maestra: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "EncuestaMaestra", // nombre de la tabla relacionada
          key: "id_encuesta_maestra",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true,
        comment: "Respuesta del Alumno",
        defaultValue: Sequelize.literal(
          "CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP"
        ),
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("Encuesta");
  }
};
