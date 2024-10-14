'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Facultad extends Model {
    static associate(models) {
      // Define associations here
      Facultad.hasMany(models.Usuario, {
        foreignKey: 'fid_facultad',
        as: 'Usuarios'
      });
      
      Facultad.hasMany(models.Programa, {
        foreignKey: 'fid_facultad',
        as: 'Programas'
      });

      Facultad.belongsTo(models.Usuario, {
        foreignKey: 'fid_usuario',
        as: 'Encargado'
      });
    }
  }
  Facultad.init({
    id_facultad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    fid_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    siglas: {
      type: DataTypes.STRING(10),
      allowNull: true
    },
    esActivo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'Facultad',
    tableName: 'Facultad',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (facultad, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Facultad',
          action: 'INSERT',
          newValues: facultad.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (facultad, options) => {
        const { performedBy } = options;
        const previousValues = facultad._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'Facultad',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: facultad.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (facultad, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Facultad',
          action: 'DELETE',
          oldValues: facultad.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return Facultad;
};
