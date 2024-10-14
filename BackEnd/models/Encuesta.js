'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Encuesta extends Model {
    static associate(models) {
      Encuesta.belongsTo(models.Usuario, {
        foreignKey: 'fid_alumno',
        as: 'Alumno'
      });
      Encuesta.belongsTo(models.EstadoEncuesta, {
        foreignKey: 'fid_estado_encuesta',
        as: 'EstadoEncuesta'
      });
      Encuesta.belongsTo(models.EncuestaMaestra, {
        foreignKey: 'fid_encuesta_maestra',
        as: 'EncuestaMaestra'
      });
      Encuesta.hasMany(models.Respuesta, {
        foreignKey: 'fid_encuesta',
        as: 'Respuestas'
      });
    }
  }

  Encuesta.init(
    {
      id_encuesta: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fid_encuesta_maestra: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fid_alumno: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fid_estado_encuesta: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes.NOW,
      },
      fechaActualizacion: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      esActivo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true,
      },
    },
    {
      sequelize,
      modelName: "Encuesta",
      tableName: "Encuesta",
      timestamps: true,
      updatedAt: "fechaActualizacion",
      createdAt: "fechaCreacion",
      hooks: {
        afterCreate: async (encuesta, options) => {
          const { performedBy } = options;
          await sequelize.models.Audit.create({
            tableName: 'Encuesta',
            action: 'INSERT',
            newValues: encuesta.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
        beforeUpdate: async (encuesta, options) => {
          const { performedBy } = options;
          const previousValues = encuesta._previousDataValues;
          await sequelize.models.Audit.create({
            tableName: 'Encuesta',
            action: 'UPDATE',
            oldValues: previousValues,
            newValues: encuesta.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
        beforeDestroy: async (encuesta, options) => {
          const { performedBy } = options;
          await sequelize.models.Audit.create({
            tableName: 'Encuesta',
            action: 'DELETE',
            oldValues: encuesta.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
      },
    }
  );

  return Encuesta;
};
