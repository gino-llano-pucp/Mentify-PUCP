'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AsignacionTutorAlumno extends Model {
    static associate(models) {
      AsignacionTutorAlumno.belongsTo(models.Usuario, {
        foreignKey: 'fid_tutor',
        as: 'Tutor'
      });
      AsignacionTutorAlumno.belongsTo(models.Usuario, {
        foreignKey: 'fid_alumno',
        as: 'Alumno'
      });
      AsignacionTutorAlumno.belongsTo(models.TipoTutoria, {
        foreignKey: 'fid_tipoTutoria',
        as: 'TipoTutoria'
      });
      AsignacionTutorAlumno.belongsTo(models.SolicitudTutorFijo, {
        foreignKey: 'fid_solicitud',
        as: 'Solicitud'
      });
    }
  }

  AsignacionTutorAlumno.init({
    id_asignacionTutorAlumno: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_alumno: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_tutor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_tipoTutoria: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_solicitud: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    esActivo: {
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
    modelName: 'AsignacionTutorAlumno',
    tableName: 'AsignacionTutorAlumno',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (asignacion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'AsignacionTutorAlumno',
          action: 'INSERT',
          newValues: asignacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (asignacion, options) => {
        const { performedBy } = options;
        const previousValues = asignacion._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'AsignacionTutorAlumno',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: asignacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (asignacion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'AsignacionTutorAlumno',
          action: 'DELETE',
          oldValues: asignacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return AsignacionTutorAlumno;
};
