'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('RolOpciones', {
      id_rol_opcion: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_opcion: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'OpcionSidebar',
          key: 'id'
        }
      },
      id_rol: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Rol',
          key: 'id_rol'
        }
      },
      es_activo: {
        type: Sequelize.BOOLEAN,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'fechaCreacion'
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true,
        field: 'fechaActualizacion'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('RolOpciones');
  }
};
