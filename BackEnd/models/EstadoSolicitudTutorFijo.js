'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EstadoSolicitudTutorFijo extends Model {
    static associate(models) {
      EstadoSolicitudTutorFijo.hasMany(models.SolicitudTutorFijo, {
        foreignKey: 'fid_estadoSolicitud',
        as: 'Solicitudes'
      });
    }
  }

  EstadoSolicitudTutorFijo.init({
    id_estadoSolicitud: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    descripcion: {
      type: DataTypes.STRING,
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
    modelName: 'EstadoSolicitudTutorFijo',
    tableName: 'EstadoSolicitudTutorFijo',
    timestamps: false,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return EstadoSolicitudTutorFijo;
};
