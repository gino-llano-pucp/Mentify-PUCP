'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoFormato extends Model {

    static associate(models) {
      TipoFormato.hasMany(models.TipoTutoria, {
        foreignKey: 'fid_tipoFormato',
        as: 'TipoTutorias'
      });
    }

  }

  TipoFormato.init({
    id_tipoFormato: {
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
    modelName: 'TipoFormato', // Asegúrate de que el nombre del modelo sea el deseado
    tableName: 'TipoFormato',
    timestamps: true,  // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });

  return TipoFormato;
};
