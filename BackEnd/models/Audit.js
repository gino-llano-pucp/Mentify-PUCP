'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Audit extends Model {
    static associate(models) {
      Audit.belongsTo(models.Usuario, {
        foreignKey: 'performedBy',
        as: 'Usuario'
      });
    }
  }
  Audit.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tableName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    action: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    oldValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    newValues: {
      type: DataTypes.JSON,
      allowNull: true,
    },
    performedBy: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  }, {
    sequelize,
    modelName: 'Audit',
    tableName: 'Audit',
    timestamps: false,
  });
  return Audit;
};