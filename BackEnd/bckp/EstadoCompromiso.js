'use strict';
const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
    class EstadoCompromiso extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    EstadoCompromiso.init(
        {
        id_estado_compromiso: {
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
        modelName: "EstadoCompromiso",
    
        /*
        * 100% necesario sino sequelize puede crear una tabla nueva 
        * ya que los nombres los pone en plural, se puede desactivar eso btw
        */ 
        tableName: "EstadoCompromiso",
        /*
        * quitar los timestamps ya que ese dato no esta en nuestra bd, DEBERIA por ser
        * datos de auditoria pero falta implementar, una vez esos campos esten en la bd
        * se activa el timestamp, ya que nos registra automaticamente la fecha de
        * ingreso de la data o la fecha de modificacion
        */
        timestamps: false,
    });
    //EstadoCompromiso.hasPaperTrail(); // Habilita el seguimiento de cambios
    return EstadoCompromiso;
};