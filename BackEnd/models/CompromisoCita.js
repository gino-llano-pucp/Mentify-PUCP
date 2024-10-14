'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class CompromisoCita extends Model {
    static associate(models) {
      CompromisoCita.belongsTo(models.EstadoCompromisoCita, {
        foreignKey: 'fid_estado_compromiso',
        as: 'EstadoCompromiso'
      });
      CompromisoCita.belongsTo(models.ResultadoCita, {
        foreignKey: 'fid_resultado',
        as: 'ResultadoCita'
      });
    }
  }

  CompromisoCita.init({
    id_compromiso: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    es_activo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    fid_estado_compromiso: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_resultado: {
      type: DataTypes.INTEGER,
      allowNull: true
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
    modelName: 'CompromisoCita',
    tableName: 'CompromisoCita',
    timestamps: false,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (compromiso, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'CompromisoCita',
          action: 'INSERT',
          newValues: compromiso.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (compromiso, options) => {
        const { performedBy } = options;
        const previousValues = compromiso._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'CompromisoCita',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: compromiso.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (compromiso, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'CompromisoCita',
          action: 'DELETE',
          oldValues: compromiso.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return CompromisoCita;
};
