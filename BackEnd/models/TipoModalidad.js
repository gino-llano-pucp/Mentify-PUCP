'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoModalidad extends Model {
    
    static associate(models) {

        TipoModalidad.hasMany(models.SesionCita, {
        foreignKey: 'fid_tipoModalidad',
        as: 'SesionesCita'
      });
        
    }
      
  }

  TipoModalidad.init({
    id_tipoModalidad: {
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
    modelName: 'TipoModalidad', // Asegúrate de que el nombre del modelo sea el deseado
    tableName: 'TipoModalidad',
    timestamps: true,  // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return TipoModalidad;
};
