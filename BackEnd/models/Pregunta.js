'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Pregunta extends Model {
    static associate(models) {
      Pregunta.hasMany(models.Opcion, {
        foreignKey: 'fid_pregunta',
        as: 'Opciones'
      });
    }
  }

  Pregunta.init({
    id_pregunta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    enunciado: {
      type: DataTypes.STRING,
      allowNull: false
    },
    es_rspta_unica: {
      type: DataTypes.BOOLEAN,
      allowNull: false
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
    modelName: 'Pregunta',
    tableName: 'Pregunta',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });

  return Pregunta;
};
