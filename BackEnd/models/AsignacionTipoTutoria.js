'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class AsignacionTipoTutoria extends Model {
    static associate(models) {
      // Relación con la tabla Usuario
      AsignacionTipoTutoria.belongsTo(models.Usuario, {
        foreignKey: 'fid_usuario',
        as: 'Tutor'
      });
      AsignacionTipoTutoria.belongsTo(models.Usuario, {
        foreignKey: 'fid_usuario',
        as: 'Alumno'
      });

      // Relación con la tabla TipoTutoria
      AsignacionTipoTutoria.belongsTo(models.TipoTutoria, {
        foreignKey: 'fid_tipoTutoria',
        as: 'TipoTutoria'
      });
    }
  }

  AsignacionTipoTutoria.init({
    id_asignacionTipoTutoria: {
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
    fid_tipoTutoria: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'TipoTutoria',
        key: 'id_tipoTutoria'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    },
    esTutor: {
      type: DataTypes.BOOLEAN,
      allowNull: true,
      defaultValue: false,
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
    modelName: 'AsignacionTipoTutoria',
    tableName: 'AsignacionTipoTutoria',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (asignacion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'AsignacionTipoTutoria',
          action: 'INSERT',
          newValues: asignacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (asignacion, options) => {
        const { performedBy } = options;
        const previousValues = asignacion._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'AsignacionTipoTutoria',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: asignacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (asignacion, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'AsignacionTipoTutoria',
          action: 'DELETE',
          oldValues: asignacion.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });
  return AsignacionTipoTutoria;
};
