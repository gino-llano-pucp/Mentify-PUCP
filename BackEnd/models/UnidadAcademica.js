'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class UnidadAcademica extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */

  }
  UnidadAcademica.init({
    id_unidad_academica: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    siglas: {
      type: DataTypes.STRING(20), // Length based on expected data
      allowNull: false
    },
    correoDeContacto: {
      type: DataTypes.STRING(100),
      allowNull: false
    },
    esActivo: {
      type: DataTypes.TINYINT,
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
    modelName: 'UnidadAcademica',
    tableName: 'UnidadAcademica',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (unidadAcademica, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'UnidadAcademica',
          action: 'INSERT',
          newValues: unidadAcademica.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (unidadAcademica, options) => {
        const { performedBy } = options;
        const previousValues = unidadAcademica._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'UnidadAcademica',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: unidadAcademica.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (unidadAcademica, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'UnidadAcademica',
          action: 'DELETE',
          oldValues: unidadAcademica.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return UnidadAcademica;
};
