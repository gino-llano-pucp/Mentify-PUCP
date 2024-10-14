'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Rol extends Model {
    static associate(models) {
      Rol.belongsToMany(models.Usuario, {
        through: 'Roles_Usuario', // Nombre de la tabla intermedia
        as: 'Usuarios',
        foreignKey: 'id_rol',
        otherKey: 'id_usuario'
      });
      Rol.belongsToMany(models.OpcionSidebar, {
        through: 'RolOpciones',
        as: 'opciones',
        foreignKey: 'id_rol',
        otherKey: 'id_opcion'
      });
    }
  }
  Rol.init({
    id_rol: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    es_activo: {
      type: DataTypes.TINYINT,
      allowNull: true
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
    modelName: 'Rol',
    tableName: 'Rol',
    timestamps: true,  // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion'
  });
  
  return Rol;
};
