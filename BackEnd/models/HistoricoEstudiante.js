'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class HistoricoEstudiante extends Model {
    static associate(models) {
      // Define the relationship with Usuario
      HistoricoEstudiante.belongsTo(models.Usuario, {
        foreignKey: 'fid_alumno',
        as: 'Alumno'
      });
    }
  }

  HistoricoEstudiante.init({
    id_registro: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_alumno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    nota: {
      type: DataTypes.BLOB('long'),
      allowNull: true
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: false
    },
    creadoPor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    actualizadoPor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    esActivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'HistoricoEstudiante',
    tableName: 'HistoricoEstudiante',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (historicoEstudiante, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'HistoricoEstudiante',
          action: 'INSERT',
          newValues: historicoEstudiante.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (historicoEstudiante, options) => {
        const { performedBy } = options;
        const previousValues = historicoEstudiante._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'HistoricoEstudiante',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: historicoEstudiante.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (historicoEstudiante, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'HistoricoEstudiante',
          action: 'DELETE',
          oldValues: historicoEstudiante.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return HistoricoEstudiante;
};
