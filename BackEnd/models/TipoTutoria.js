'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoTutoria extends Model {

    static associate(models) {
      TipoTutoria.belongsTo(models.TipoTutor, {
        foreignKey: 'fid_tipoTutor', // Clave foránea en TipoTutoria
        as: 'TipoTutor' // Alias para la relación
      });
      TipoTutoria.belongsTo(models.TipoFormato, {
        foreignKey: 'fid_tipoFormato', 
        as: 'TipoFormato' // Alias para la relación
      });
      TipoTutoria.belongsTo(models.TipoObligatoriedad, {
        foreignKey: 'fid_tipoObligatoriedad', 
        as: 'TipoObligatoriedad' // Alias para la relación
      });
      TipoTutoria.belongsTo(models.TipoPermanencia, {
        foreignKey: 'fid_tipoPermanencia', 
        as: 'TipoPermanencia' // Alias para la relación
      });
      TipoTutoria.belongsTo(models.Facultad, {
        foreignKey: 'fid_facultad', 
        as: 'Facultad' // Alias para la relación
      });
      TipoTutoria.belongsToMany(models.Usuario, {
        through: 'AsignacionTipoTutoria',
        foreignKey: 'fid_tipoTutoria',  // Asegúrate de que este nombre corresponde al campo en la base de datos.
        otherKey: 'fid_usuario',       // Asegúrate de agregar el otherKey para especificar la clave foránea del otro modelo en la tabla intermedia.
        as: 'Usuarios'
      });
      TipoTutoria.hasMany(models.AsignacionTutorAlumno, {
        foreignKey: 'fid_tipoTutoria',
        as: 'AsignacionesTutorAlumno'
      });
      TipoTutoria.hasMany(models.SesionCita, {
        foreignKey: 'fid_tipoTutoria',
        as: 'SesionesCita'
      });
    }

  }

  TipoTutoria.init({
    id_tipoTutoria: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING(100),
      allowNull: true
    },
    fid_tipoObligatoriedad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TipoObligatoriedad',
        key: 'id_tipoObligatoriedad'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fid_tipoPermanencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TipoPermanencia',
        key: 'id_tipoPermanencia'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fid_tipoTutor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TipoTutor',
        key: 'id_tipoTutor'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fid_tipoFormato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'TipoFormato',
        key: 'id_tipoFormato'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fid_facultad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Facultad',
        key: 'id_facultad'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    },
    fid_programa: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Programa',
        key: 'id_programa'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
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
    modelName: 'TipoTutoria', // Asegúrate de que el nombre del modelo sea el deseado
    tableName: 'TipoTutoria',
    timestamps: true,  // Ajusta según si necesitas manejo automático de timestamps
    createdAt: 'fechaCreacion',
    updatedAt: 'fechaActualizacion',
    hooks: {
      afterCreate: async (tipoTutoria, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'TipoTutoria',
          action: 'INSERT',
          newValues: tipoTutoria.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeUpdate: async (tipoTutoria, options) => {
        const { performedBy } = options;
        const previousValues = tipoTutoria._previousDataValues;
        await sequelize.models.Audit.create({
          tableName: 'TipoTutoria',
          action: 'UPDATE',
          oldValues: previousValues,
          newValues: tipoTutoria.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
      beforeDestroy: async (tipoTutoria, options) => {
        const { performedBy } = options;
        await sequelize.models.Audit.create({
          tableName: 'TipoTutoria',
          action: 'DELETE',
          oldValues: tipoTutoria.toJSON(),
          performedBy,
          timestamp: new Date(),
        });
      },
    }
  });

  return TipoTutoria;
};
