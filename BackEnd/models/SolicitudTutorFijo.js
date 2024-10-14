'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SolicitudTutorFijo extends Model {
    // Definición del modelo SolicitudTutorFijo
    static associate(models) {
      SolicitudTutorFijo.belongsTo(models.Usuario, {
        foreignKey: 'fid_alumno',
        as: 'Alumno'
      });
      SolicitudTutorFijo.belongsTo(models.Usuario, {
        foreignKey: 'fid_tutor',
        as: 'Tutor'
      });
      SolicitudTutorFijo.belongsTo(models.EstadoSolicitudTutorFijo, {
        foreignKey: 'fid_estadoSolicitud',
        as: 'EstadoSolicitud'
      });
      SolicitudTutorFijo.hasMany(models.AsignacionTutorAlumno, {
        foreignKey: 'fid_solicitud',
        as: 'Asignaciones'
      });
      SolicitudTutorFijo.belongsTo(models.TipoTutoria, {
        foreignKey: 'fid_tipoTutoria',
        as: 'TipoTutoria'
      });
    }
  }

  SolicitudTutorFijo.init({
    id_solicitud: {
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
    esRechazado: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    motivoRechazo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fid_estadoSolicitud: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaRegistro: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    fechaCierre: {
      type: DataTypes.DATE,
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
    modelName: 'SolicitudTutorFijo',
    tableName: 'SolicitudTutorFijo',
    timestamps: false,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (solicitud, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'SolicitudTutorFijo',
          action: 'INSERT',
          newValues: solicitud.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (solicitud, options) => {
        const { performedBy } = options;
        const previousValues = solicitud._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'SolicitudTutorFijo',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: solicitud.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (solicitud, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'SolicitudTutorFijo',
          action: 'DELETE',
          oldValues: solicitud.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return SolicitudTutorFijo;
};
