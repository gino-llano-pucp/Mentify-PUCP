'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable('Roles_Usuario', {
      id_roles_usuario: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_usuario: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        }
      },
      id_rol: {
        type: Sequelize.INTEGER,
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechaActualizacion: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });
  },
  async down (queryInterface, Sequelize) {    
    await queryInterface.dropTable('Roles_Usuario');
  }
};
