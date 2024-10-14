const { DataTypes, Model } = require('sequelize');
const sequelize = require('../config/mysql');

class UnidadesAcademicas extends Model {}

UnidadesAcademicas.init({
    
    id_unidad_academica: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
    
},
    {
        sequelize,
        modelName: "UnidadesAcademicas",
        tableName: "UnidadesAcademicas",
        timestamps: false
    }
);

module.exports = UnidadesAcademicas;