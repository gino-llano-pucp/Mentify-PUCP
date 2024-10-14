'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Opcion extends Model {
    static associate(models) {
      Opcion.belongsTo(models.Pregunta, {
        foreignKey: 'fid_pregunta',
        as: 'Pregunta'
      });
      Opcion.hasMany(models.Respuesta, {
        foreignKey: 'fid_opcion',
        as: 'Respuestas'
      });
    }
  }

  Opcion.init({
    id_opcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_pregunta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Pregunta',
        key: 'id_pregunta'
      }
    },
    enunciado: {
      type: DataTypes.STRING,
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
    modelName: 'Opcion',
    tableName: 'Opcion',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });

  return Opcion;
};
