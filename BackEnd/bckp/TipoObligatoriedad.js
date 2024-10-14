'use strict';
const {
  Model
} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class TipoObligatoriedad extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TipoObligatoriedad.init({
    id_tipoObligatoriedad: {
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
    modelName: 'TipoObligatoriedad',
    tableName: 'TipoObligatoriedad',
    timestamps: false  // Ajusta según si necesitas manejo automático de timestamps
  });
  //TipoObligatoriedad.hasPaperTrail(); // Habilita el seguimiento de cambios
  return TipoObligatoriedad;
};
