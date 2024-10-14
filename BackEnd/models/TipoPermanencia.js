'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoPermanencia extends Model {

    static associate(models) {
        TipoPermanencia.hasMany(models.TipoTutoria, {
            foreignKey: 'fid_tipoPermanencia',
            as: 'TipoTutorias'
        });
    }
  }
  TipoPermanencia.init({
    id_tipoPermanencia: {
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
    modelName: 'TipoPermanencia',
    tableName: 'TipoPermanencia',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return TipoPermanencia;
};
