'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Institucion extends Model {
    static associate(models) {
      // define association here
    }
  }
  Institucion.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    siglas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    logo: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
  }, {
    sequelize,
    modelName: 'Institucion',
    tableName: 'Institucion',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (institucion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Institucion',
          action: 'INSERT',
          newValues: institucion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (institucion, options) => {
        const { performedBy } = options;
        const previousValues = institucion._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'Institucion',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: institucion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (institucion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Institucion',
          action: 'DELETE',
          oldValues: institucion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return Institucion;
};
