'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Respuesta extends Model {
    static associate(models) {
      Respuesta.belongsTo(models.Encuesta, {
        foreignKey: 'fid_encuesta',
        as: 'Encuesta'
      });
      Respuesta.belongsTo(models.Opcion, {
        foreignKey: 'fid_opcion',
        as: 'Opcion'
      });
    }
  }

  Respuesta.init({
    id_respuesta: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    fid_encuesta: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Encuesta',
        key: 'id_encuesta'
      }
    },
    fid_opcion: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Opcion',
        key: 'id_opcion'
      }
    },
    esActivo: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true
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
    modelName: 'Respuesta',
    tableName: 'Respuesta',
    timestamps: true,
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (respuesta, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Respuesta',
          action: 'INSERT',
          newValues: respuesta.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (respuesta, options) => {
        const { performedBy } = options;
        const previousValues = respuesta._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'Respuesta',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: respuesta.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (respuesta, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'Respuesta',
          action: 'DELETE',
          oldValues: respuesta.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });

  return Respuesta;
};
