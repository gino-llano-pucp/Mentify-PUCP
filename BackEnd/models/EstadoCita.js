'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EstadoCita extends Model {
    static associate(models) {
      EstadoCita.hasMany(models.SesionCita, {
        foreignKey: 'fid_estado_cita',
        as: 'SesionesCita'
      });
    }
  }

  EstadoCita.init({
    id_estado_cita: {
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
    es_activo: {
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
    modelName: 'EstadoCita',
    tableName: 'EstadoCita',
    timestamps: false,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return EstadoCita;
};
