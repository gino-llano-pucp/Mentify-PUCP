'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoTutor extends Model {

    static associate(models) {
      TipoTutor.hasMany(models.TipoTutoria, {
        foreignKey: 'fid_tipoTutor',
        as: 'TipoTutorias'
      });
    }
  }

  TipoTutor.init({
    id_tipoTutor: {
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
    modelName: 'TipoTutor', // Asegúrate de que el nombre del modelo sea el deseado
    tableName: 'TipoTutor',
    timestamps: true,  // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });

  return TipoTutor;
};
