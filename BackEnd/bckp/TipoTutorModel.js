const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/mysql'); 

class TipoTutor extends Model {}

TipoTutor.init({
    idTipoTutor: {
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
    modelName: 'TipoTutor',
    tableName: 'TipoTutor',
    timestamps: false
});

module.exports = TipoTutor;