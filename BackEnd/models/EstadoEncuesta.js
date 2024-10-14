'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EstadoEncuesta extends Model {
    static associate(models) {
      EstadoEncuesta.hasMany(models.Encuesta, {
        foreignKey: 'fid_estado_encuesta',
        as: 'Encuestas'
      });
    }
  }

  EstadoEncuesta.init({
    id_estado_encuesta: {
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
    modelName: 'EstadoEncuesta',
    tableName: 'EstadoEncuesta',
    timestamps: false
  });

  return EstadoEncuesta;
};
