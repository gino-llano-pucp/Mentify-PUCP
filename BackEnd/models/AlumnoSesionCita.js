"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class AlumnoSesionCita extends Model {
    static associate(models) {
      AlumnoSesionCita.belongsTo(models.Usuario, {
        foreignKey: "fid_alumno",
        as: "Alumno",
      });
      AlumnoSesionCita.belongsTo(models.SesionCita, {
        foreignKey: "fid_sesionCita",
        as: "SesionCita",
      });
    }
  }

  AlumnoSesionCita.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fid_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Usuario",
          key: "id_usuario",
        },
      },
      fid_sesionCita: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "SesionCita",
          key: "id_cita",
        },
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      fechaActualizacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      modelName: "AlumnoSesionCita",
      tableName: "AlumnoSesionCita",
      timestamps: true,
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion',
      hooks: {
        afterCreate: async (record, options) => {
          const { performedBy } = options;
          await sequelize.models.Audit.create({
            tableName: 'AlumnoSesionCita',
            action: 'INSERT',
            newValues: record.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
        beforeUpdate: async (record, options) => {
          const { performedBy } = options;
          const previousValues = record._previousDataValues;
          await sequelize.models.Audit.create({
            tableName: 'AlumnoSesionCita',
            action: 'UPDATE',
            oldValues: previousValues,
            newValues: record.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
        beforeDestroy: async (record, options) => {
          const { performedBy } = options;
          await sequelize.models.Audit.create({
            tableName: 'AlumnoSesionCita',
            action: 'DELETE',
            oldValues: record.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
      },
    }
  );

  return AlumnoSesionCita;
};
