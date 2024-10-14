'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class SesionCita extends Model {
    static associate(models) {
      SesionCita.belongsTo(models.Usuario, {
        foreignKey: 'fid_tutor',
        as: 'Tutor'
      });
      SesionCita.belongsTo(models.TipoTutoria, {
        foreignKey: 'fid_tipoTutoria',
        as: 'TipoTutoria'
      });
      SesionCita.belongsTo(models.ResultadoCita, {
        foreignKey: 'fid_resultado',
        as: 'Resultado'
      });
      SesionCita.belongsTo(models.Derivacion, {
        foreignKey: 'fid_derivacion',
        as: 'Derivacion'
      });
      SesionCita.belongsTo(models.EstadoCita, {
        foreignKey: 'fid_estado_cita',
        as: 'EstadoCita'
      });
      SesionCita.belongsTo(models.TipoModalidad, {
        foreignKey: 'fid_tipoModalidad',
        as: 'TipoModalidad'
      });
      SesionCita.belongsToMany(models.Usuario, {
        through: 'AlumnoSesionCita',
        foreignKey: 'fid_sesionCita',
        otherKey: 'fid_alumno',
        as: 'Alumnos'
      });
      SesionCita.hasMany(models.CompromisoCita, { foreignKey: 'fid_sesionCita', as: 'CompromisosCita' });
      // Ensure this association is set
      SesionCita.hasMany(models.AlumnoSesionCita, { foreignKey: 'fid_sesionCita', as: 'AlumnoSesionCitas' });
      // Añadir esto en la función static associate de SesionCita   
      SesionCita.hasMany(models.AsistenciaCita, { foreignKey: 'fid_sesionCita', as: 'Asistencias' });

    }
  }

  SesionCita.init({
    id_cita: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_tutor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fid_alumno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fid_tipoTutoria: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fid_resultado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fid_derivacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    lugar_link: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fid_estado_cita: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaHoraInicio: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fechaHoraFin: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    fid_tipoModalidad: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: true
    },
    esActivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    },
    fechaHoraInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaHoraFin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    motivoRechazo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    sequelize,
    modelName: 'SesionCita',
    tableName: 'SesionCita',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (sesion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'SesionCita',
          action: 'INSERT',
          newValues: sesion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (sesion, options) => {
        const { performedBy } = options;
        const previousValues = sesion._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'SesionCita',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: sesion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (sesion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'SesionCita',
          action: 'DELETE',
          oldValues: sesion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });

  return SesionCita;
};
