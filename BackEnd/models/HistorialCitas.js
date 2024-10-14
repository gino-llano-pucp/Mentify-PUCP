'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class HistorialCitas extends Model {
    static associate(models) {
      // Relaciona HistorialCitas con el modelo Usuario para capturar quién hizo el cambio
      HistorialCitas.belongsTo(models.Usuario, {
        foreignKey: 'usuarioModifico',
        as: 'Usuario'
      });
      // Relaciona HistorialCitas con SesionCita para referenciar la cita modificada
      HistorialCitas.belongsTo(models.SesionCita, {
        foreignKey: 'citaId',
        as: 'Cita'
      });
    }
  }

  HistorialCitas.init({
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    citaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'SesionCita',
        key: 'id_cita'
      }
    },
    fechaHoraInicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaHoraFin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    tipoModalidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    lugar: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usuarioModifico: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Usuario',
        key: 'id_usuario'
      }
    },
    fechaModificacion: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'HistorialCitas',
    tableName: 'HistorialCitas',
    timestamps: false
  });

  return HistorialCitas;
};
