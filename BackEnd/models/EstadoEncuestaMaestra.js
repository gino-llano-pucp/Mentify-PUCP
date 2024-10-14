'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EstadoEncuestaMaestra extends Model {
    static associate(models) {
      EstadoEncuestaMaestra.hasMany(models.EncuestaMaestra, {
        foreignKey: 'fid_estado_encuesta_maestra',
        as: 'EncuestasMaestras'
      });
    }
  }

  EstadoEncuestaMaestra.init({
    id_estado_encuesta_maestra: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    esActivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  }, {
    sequelize,
    modelName: 'EstadoEncuestaMaestra',
    tableName: 'EstadoEncuestaMaestra',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
  });

  return EstadoEncuestaMaestra;
};
