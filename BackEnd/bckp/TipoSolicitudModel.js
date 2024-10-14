const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/mysql'); 

class TipoSolicitud extends Model {}

TipoSolicitud.init({
    idTipoSolicitud: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING(255),
        allowNull: true
    },
    es_activo: {
        type: DataTypes.TINYINT,
        allowNull: true
    }
}, {
    sequelize,
    modelName: 'TipoSolicitud',
    tableName: 'TipoSolicitud',
    timestamps: false
});

module.exports = TipoSolicitud;
