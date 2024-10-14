"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class EncuestaMaestra extends Model {
    static associate(models) {
      EncuestaMaestra.belongsTo(models.Facultad, {
        foreignKey: "fid_facultad",
        as: "Facultad",
      });
      EncuestaMaestra.belongsTo(models.EstadoEncuestaMaestra, {
        foreignKey: "fid_estado_encuesta_maestra",
        as: "EstadoEncuestaMaestra",
      });
      EncuestaMaestra.hasMany(models.Encuesta, { 
        foreignKey: 'fid_encuesta_maestra',
        as: 'Encuestas' 
      });
    }
  }

  EncuestaMaestra.init(
    {
      id_encuesta_maestra: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      fid_facultad: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: 'Facultad',
          key: 'id_facultad'
        }
      },
      titulo: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: true,
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
      fid_estado_encuesta_maestra: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: "EncuestaMaestra",
      tableName: "EncuestaMaestra",
      timestamps: true,
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion",
      hooks: {
        afterCreate: async (encuestaMaestra, options) => {
          const { performedBy } = options;
          await sequelize.models.Audit.create({
            tableName: 'EncuestaMaestra',
            action: 'INSERT',
            newValues: encuestaMaestra.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
        beforeUpdate: async (encuestaMaestra, options) => {
          const { performedBy } = options;
          const previousValues = encuestaMaestra._previousDataValues;
          await sequelize.models.Audit.create({
            tableName: 'EncuestaMaestra',
            action: 'UPDATE',
            oldValues: previousValues,
            newValues: encuestaMaestra.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
        beforeDestroy: async (encuestaMaestra, options) => {
          const { performedBy } = options;
          await sequelize.models.Audit.create({
            tableName: 'EncuestaMaestra',
            action: 'DELETE',
            oldValues: encuestaMaestra.toJSON(),
            performedBy,
            timestamp: new Date(),
          });
        },
      },
    }
  );

  return EncuestaMaestra;
};
