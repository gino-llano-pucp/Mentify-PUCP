"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Usuario extends Model {
    static associate(models) {
      Usuario.belongsToMany(models.Rol, {
        through: "Roles_Usuario",
        as: "Roles",
        foreignKey: "id_usuario",
        otherKey: "id_rol",
      });
      Usuario.belongsTo(models.Facultad, {
        foreignKey: "fid_facultad",
        as: "Facultad",
      });
      Usuario.belongsTo(models.Programa, {
        foreignKey: "fid_programa",
        as: "Programa",
      });

      Usuario.hasMany(models.AsignacionTipoTutoria, {
        foreignKey: "fid_usuario",
        as: "AsignacionesTipoTutoria",
      });
      Usuario.belongsToMany(models.TipoTutoria, {
        through: "AsignacionTipoTutoria",
        foreignKey: "fid_usuario",
        otherKey: "fid_tipoTutoria",
        as: "TipoTutorias",
      });
      Usuario.belongsToMany(models.SesionCita, {
        through: "AlumnoSesionCita",
        foreignKey: "fid_alumno",
        otherKey: "fid_sesionCita",
        as: "SesionesCita",
      });
      Usuario.hasMany(models.SolicitudTutorFijo, {
        foreignKey: "fid_alumno",
        as: "SolicitudesAlumno",
      });
      Usuario.hasMany(models.SolicitudTutorFijo, {
        foreignKey: "fid_tutor",
        as: "SolicitudesTutor",
      });
      Usuario.hasMany(models.AsignacionTutorAlumno, {
        foreignKey: "fid_tutor",
        as: "TutorAsignaciones",
      });
      Usuario.hasMany(models.AsignacionTutorAlumno, {
        foreignKey: "fid_alumno",
        as: "AlumnoAsignaciones",
      });
      Usuario.hasMany(models.SesionCita, {
        foreignKey: "fid_tutor",
        as: "SesionesCitaTutor",
      });
      Usuario.hasMany(models.SesionCita, {
        foreignKey: "fid_alumno",
        as: "SesionesCitaAlumno",
      });
      Usuario.hasMany(models.Derivacion, {
        foreignKey: "fid_tutor",
        as: "DerivacionesTutor",
      });
      Usuario.hasMany(models.Derivacion, {
        foreignKey: "fid_alumno",
        as: "DerivacionesAlumno",
      });
      Usuario.hasMany(models.Encuesta, {
        foreignKey: "fid_alumno",
        as: "EncuestasAlumno",
      });
      Usuario.hasMany(models.AsistenciaCita, {
        foreignKey: "fid_alumno",
        as: "Asistencias",
      });

      // Nueva relación
      Usuario.hasMany(models.AlumnoSesionCita, {
        foreignKey: "fid_alumno",
        as: "AlumnoSesionCitas",
      });

      Usuario.hasMany(models.Audit, { foreignKey: 'performedBy', as: 'Auditorias' });
    }
  }
  Usuario.init(
    {
      id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      email: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      codigo: {
        type: DataTypes.STRING(10),
        allowNull: true,
      },
      nombres: {
        type: DataTypes.STRING(150),
        allowNull: true,
      },
      primerApellido: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      segundoApellido: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      esActivo: {
        type: DataTypes.TINYINT,
        allowNull: false,
        defaultValue: true,
      },
      contrasenha: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      imagen: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      fechaCreacion: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fechaActualizacion: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      fid_facultad: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      fid_programa: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Usuario",
      tableName: "Usuario",
      timestamps: true,
      createdAt: "fechaCreacion",
      updatedAt: "fechaActualizacion",
      hooks: {
        afterCreate: async (usuario, options) => {
          const { performedBy , transaction } = options;
          await sequelize.models.Audit.create({
            tableName: 'Usuario',
            action: 'INSERT',
            newValues: usuario.toJSON(),
            performedBy,
            timestamp: new Date(),
          }, { transaction });
        },
        beforeUpdate: async (usuario, options) => {
          const { performedBy , transaction } = options;
          const previousValues = usuario._previousDataValues;
          await sequelize.models.Audit.create({
            tableName: 'Usuario',
            action: 'UPDATE',
            oldValues: previousValues,
            newValues: usuario.toJSON(),
            performedBy,
            timestamp: new Date(),
          }, { transaction });
        },
        beforeDestroy: async (usuario, options) => {
          const { performedBy , transaction } = options;
          await sequelize.models.Audit.create({
            tableName: 'Usuario',
            action: 'DELETE',
            oldValues: usuario.toJSON(),
            performedBy,
            timestamp: new Date(),
          }, { transaction });
        },
      },
    }
  );
  return Usuario;
};
