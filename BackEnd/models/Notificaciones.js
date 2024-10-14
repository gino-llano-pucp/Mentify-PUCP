'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class Notificacion extends Model {
        static associate(models) {
            Notificacion.belongsTo(models.Usuario, {
                foreignKey: 'fid_usuario',
                as: 'Usuario'
            });
            Notificacion.belongsTo(models.SesionCita, {
                foreignKey: 'fid_sesionCita',
                as: 'SesionCita'
            });
        }
    }

    Notificacion.init({
        id_notificacion: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        fid_usuario: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        fid_sesionCita: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        tipo: {
            type: DataTypes.ENUM('recordatorio', 'cambio', 'cancelación', 'confirmación'),
            allowNull: false
        },
        leido: {
            type: DataTypes.BOOLEAN,
            defaultValue: false
        },
        fechaHoraInicio: {
            type: DataTypes.DATE,
            allowNull: true
        },
        fechaHoraFin: {
            type: DataTypes.DATE,
            allowNull: true
        },
        modalidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        lugar: {
            type: DataTypes.STRING,
            allowNull: true
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
        modelName: 'Notificacion',
        tableName: 'Notificaciones',
        timestamps: true,
        createdAt: 'fechaCreacion',
        updatedAt: 'fechaActualizacion',
        hooks: {
            afterCreate: async (notificacion, options) => {
                const { performedBy } = options;
                await sequelize.models.Audit.create({
                    tableName: 'Notificacion',
                    action: 'INSERT',
                    newValues: notificacion.toJSON(),
                    performedBy,
                    timestamp: new Date(),
                });
            },
            beforeUpdate: async (notificacion, options) => {
                const { performedBy } = options;
                const previousValues = notificacion._previousDataValues;
                await sequelize.models.Audit.create({
                    tableName: 'Notificacion',
                    action: 'UPDATE',
                    oldValues: previousValues,
                    newValues: notificacion.toJSON(),
                    performedBy,
                    timestamp: new Date(),
                });
            },
            beforeDestroy: async (notificacion, options) => {
                const { performedBy } = options;
                await sequelize.models.Audit.create({
                    tableName: 'Notificacion',
                    action: 'DELETE',
                    oldValues: notificacion.toJSON(),
                    performedBy,
                    timestamp: new Date(),
                });
            },
        }
    });

    return Notificacion;
};
