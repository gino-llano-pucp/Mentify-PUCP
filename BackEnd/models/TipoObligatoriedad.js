'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoObligatoriedad extends Model {

    static associate(models) {

      TipoObligatoriedad.hasMany(models.TipoTutoria, {
        foreignKey: 'fid_tipoObligatoriedad',
        as: 'TipoTutorias'
      });

    }

  }

  TipoObligatoriedad.init({
    id_tipoObligatoriedad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    esActivo: {
      type: DataTypes.TINYINT,
      allowNull: false,
      defaultValue: true,
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
    modelName: 'TipoObligatoriedad', // Asegúrate de que el nombre del modelo sea el deseado
    tableName: 'TipoObligatoriedad',
    timestamps: true,  // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return TipoObligatoriedad;
};
