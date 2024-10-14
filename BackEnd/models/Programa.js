'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Programa extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      
      Programa.belongsTo(models.Facultad, {
        foreignKey: 'fid_facultad',
        as: 'Facultad'
      });
      
      Programa.hasMany(models.Usuario, {
        foreignKey: 'fid_programa',
        as: 'Usuarios'
      });
      Programa.belongsTo(models.Usuario, {
        foreignKey: 'fid_usuario',
        as: 'Encargado' // Aquí defines el alias que usarás en tus consultas
      });
    }
  }
  Programa.init({
    id_programa: {
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
    },
    fid_facultad: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'Programa', // Asegúrate de que el nombre del modelo sea el deseado
    tableName: 'Programa',
    timestamps: true,  // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (programa, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Programa',
          action: 'INSERT',
          newValues: programa.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (programa, options) => {
        const { performedBy } = options;
        const previousValues = programa._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'Programa',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: programa.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (programa, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Programa',
          action: 'DELETE',
          oldValues: programa.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return Programa;
};
