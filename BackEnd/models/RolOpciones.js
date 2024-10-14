'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class RolOpciones extends Model {
    static associate(models) {
      // Aquí puedes definir asociaciones adicionales si es necesario
    }
  }
  RolOpciones.init({
    id_rol_opcion: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_opcion: {
      type: DataTypes.INTEGER,
      references: {
        model: 'OpcionSidebar', // Asegúrate de que el nombre del modelo sea correcto
        key: 'id'
      }
    },
    id_rol: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rol', // Asegúrate de que el nombre del modelo sea correcto
        key: 'id_rol'
      }
    },
    es_activo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    fechaCreacion: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fechaCreacion'
    },
    fechaActualizacion: {
      type: DataTypes.DATE,
      allowNull: true,
      field: 'fechaActualizacion'
    }
  }, {
    sequelize,
    modelName: 'RolOpciones',
    tableName: 'RolOpciones',
    timestamps: true, // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  return RolOpciones;
};
