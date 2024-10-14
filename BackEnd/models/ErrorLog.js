'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class ErrorLog extends Model {
    static associate(models) {
      ErrorLog.belongsTo(models.Usuario, {
        foreignKey: 'fid_usuario',
        as: 'Usuario'
      });
    }
  }
  
  ErrorLog.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_usuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    errorType: {
      type: DataTypes.STRING,
      allowNull: false
    },
    errorMessage: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    stackTrace: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    endpoint: {
      type: DataTypes.STRING,
      allowNull: true
    },
    method: {
      type: DataTypes.STRING,
      allowNull: true
    },
    params: {
      type: DataTypes.JSON,
      allowNull: true
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'ErrorLog',
    tableName: 'ErrorLogs',
    timestamps: false
  });

  return ErrorLog;
};
