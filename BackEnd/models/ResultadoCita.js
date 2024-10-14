'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ResultadoCita extends Model {
    static associate(models) {
      ResultadoCita.hasMany(models.SesionCita, {
        foreignKey: 'fid_resultado',
        as: 'SesionesCita'
      });
      ResultadoCita.hasMany(models.CompromisoCita, {
        foreignKey: 'fid_resultado',
        as: 'CompromisosCita'
      });
    }
    
  }

  ResultadoCita.init({
    id_resultado: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    asistencia: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    es_derivado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    detalleResultado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    es_activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'ResultadoCita',
    tableName: 'ResultadoCita',
    timestamps: false,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (resultadoCita, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'ResultadoCita',
          action: 'INSERT',
          newValues: resultadoCita.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (resultadoCita, options) => {
        const { performedBy } = options;
        const previousValues = resultadoCita._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'ResultadoCita',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: resultadoCita.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (resultadoCita, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'ResultadoCita',
          action: 'DELETE',
          oldValues: resultadoCita.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
 
  return ResultadoCita;
};
