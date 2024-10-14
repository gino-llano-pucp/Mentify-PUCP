'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Roles_Usuario extends Model {
    static associate(models) {
      // No additional associations needed
    }
  }
  Roles_Usuario.init({
    id_roles_usuario: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    id_usuario: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Usuario',
        key: 'id_usuario'
      }
    },
    id_rol: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Rol',
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
    modelName: 'Roles_Usuario',
    tableName: 'Roles_Usuario',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (rolesUsuario, options) => {
        const { performedBy, transaction } = options;
        console.log('afterCreate performedBy:', performedBy);
        await sequelize.models.Audit.create({
          tableName: 'Roles_Usuario',
          action: 'INSERT',
          newValues: rolesUsuario.toJSON(),
          performedBy,
          timestamp: new Date(),
        }, { transaction });
      },
      beforeUpdate: async (rolesUsuario, options) => {
        const { performedBy, transaction } = options;
        console.log('beforeUpdate performedBy:', performedBy);
        const previousValues = rolesUsuario._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'Roles_Usuario',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: rolesUsuario.toJSON(),
          performedBy,
          timestamp: new Date(),
        }, { transaction });
      },
      beforeDestroy: async (rolesUsuario, options) => {
        const { performedBy, transaction } = options;
        console.log('beforeDestroy performedBy:', performedBy);
        await sequelize.models.Audit.create({
          tableName: 'Roles_Usuario',
          action: 'DELETE',
          oldValues: rolesUsuario.toJSON(),
          performedBy,
          timestamp: new Date(),
        }, { transaction });
      },
    }
  });
  return Roles_Usuario;
};
