'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class PasswordResetToken extends Model {
    static associate(models) {
      PasswordResetToken.belongsTo(models.Usuario, {
        foreignKey: 'fid_usuario',
        as: 'Usuario'
      });
    }
  }

  PasswordResetToken.init({
    id_token: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_usuario: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id_usuario'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    token: {
      type: DataTypes.STRING,
      allowNull: false
    },
    expires: {
      type: DataTypes.DATE,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'PasswordResetToken',
    tableName: 'PasswordResetToken',
    timestamps: false
  });

  return PasswordResetToken;
};
