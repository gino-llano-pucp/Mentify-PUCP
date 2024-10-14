'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EstadoCompromisoCita extends Model {
    static associate(models) {
      EstadoCompromisoCita.hasMany(models.CompromisoCita, {
        foreignKey: 'fid_estado_compromiso',
        as: 'Compromisos'
      });
    }
  }

  EstadoCompromisoCita.init({
    id_estado_compromiso: {
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
    modelName: 'EstadoCompromisoCita',
    tableName: 'EstadoCompromisoCita',
    timestamps: false
  });
  
  return EstadoCompromisoCita;
};
