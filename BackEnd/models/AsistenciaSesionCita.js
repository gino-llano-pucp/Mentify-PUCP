'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AsistenciaCita extends Model {
    static associate(models) {
      AsistenciaCita.belongsTo(models.SesionCita, {
        foreignKey: 'fid_sesionCita',
        as: 'SesionCita'
      });
      AsistenciaCita.belongsTo(models.Usuario, {
        foreignKey: 'fid_alumno',
        as: 'Alumno'
      });
    }
  }

  AsistenciaCita.init({
    id_asistencia: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_sesionCita: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_alumno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    asistio: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    }
  }, {
    sequelize,
    modelName: 'AsistenciaCita',
    tableName: 'AsistenciaCita',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (asistencia, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'AsistenciaCita',
          action: 'INSERT',
          newValues: asistencia.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (asistencia, options) => {
        const { performedBy } = options;
        const previousValues = asistencia._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'AsistenciaCita',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: asistencia.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (asistencia, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'AsistenciaCita',
          action: 'DELETE',
          oldValues: asistencia.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });

  return AsistenciaCita;
};
