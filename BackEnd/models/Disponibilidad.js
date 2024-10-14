'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Disponibilidad extends Model {
    static associate(models) {
      
      Disponibilidad.belongsTo(models.Usuario, {
        foreignKey: 'fid_tutor',
        as: 'Tutor'
      });
    }
  }

  Disponibilidad.init({
    id_disponibilidad: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_tutor: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    fechaHoraInicio: {
      type: DataTypes.DATE,
      allowNull: false
    },
    fechaHoraFin: {
      type: DataTypes.DATE,
      allowNull: false
    },
    esActivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
    }
  }, {
    sequelize,
    modelName: 'Disponibilidad',
    tableName: 'Disponibilidad',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (disponibilidad, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Disponibilidad',
          action: 'INSERT',
          newValues: disponibilidad.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (disponibilidad, options) => {
        const { performedBy } = options;
        const previousValues = disponibilidad._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'Disponibilidad',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: disponibilidad.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (disponibilidad, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Disponibilidad',
          action: 'DELETE',
          oldValues: disponibilidad.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    },
  });
  return Disponibilidad;
};
