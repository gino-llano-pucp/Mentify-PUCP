// models/opcionsidebar.js
'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class OpcionSidebar extends Model {
    static associate(models) {
      // Define association here
      OpcionSidebar.belongsToMany(models.Rol, {
        through: 'RolOpciones',
        as: 'roles',
        foreignKey: 'id_opcion',
        otherKey: 'id_rol'
      });
      OpcionSidebar.hasMany(models.OpcionSidebar, {
        foreignKey: 'parentId',
        as: 'children'
      });
      OpcionSidebar.belongsTo(models.OpcionSidebar, {
        foreignKey: 'parentId',
        as: 'parent'
      });
    }
  }
  OpcionSidebar.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    label: {
      type: DataTypes.STRING,
      allowNull: false
    },
    icon: {
      type: DataTypes.STRING,
      allowNull: true
    },
    componentId: {
      type: DataTypes.STRING,
      allowNull: true
    },
    parentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'OpcionSidebar',
        key: 'id'
      }
    }
  }, {
    sequelize,
    modelName: 'OpcionSidebar',
    tableName: 'OpcionSidebar'
  });
  return OpcionSidebar;
};
