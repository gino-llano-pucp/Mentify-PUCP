'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Derivacion extends Model {
    static associate(models) {
      Derivacion.belongsTo(models.Usuario, {
        foreignKey: 'fid_tutor',
        as: 'Tutor'
      });
      Derivacion.belongsTo(models.Usuario, {
        foreignKey: 'fid_alumno',
        as: 'Alumno'
      });
      Derivacion.belongsTo(models.SesionCita, {
        foreignKey: 'fid_cita',
        as: 'SesionCita'
      });
      Derivacion.belongsTo(models.UnidadAcademica, {
        foreignKey: 'fid_unidad_academica',
        as: 'UnidadAcademica'
      });
      Derivacion.belongsTo(models.TipoTutoria, {
        foreignKey: 'fid_tipoTutoria',
        as: 'TipoTutoria'
      });
      Derivacion.belongsTo(models.Facultad, {
        foreignKey: 'fid_facultad',
        as: 'Facultad'
      });
    }
  }

  Derivacion.init({
    id_derivacion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_tutor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_cita: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fid_alumno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_tipoTutoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    motivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    antecedentes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comentarios: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fid_unidad_academica: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_facultad: {
      type: DataTypes.INTEGER,
      allowNull: false  // Or false, depending on your requirements
    },
    esActivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
      defaultValue: DataTypes.NOW
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Derivacion',
    tableName: 'Derivacion',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (derivacion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Derivacion',
          action: 'INSERT',
          newValues: derivacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (derivacion, options) => {
        const { performedBy } = options;
        const previousValues = derivacion._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'Derivacion',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: derivacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (derivacion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Derivacion',
          action: 'DELETE',
          oldValues: derivacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return Derivacion;
};
