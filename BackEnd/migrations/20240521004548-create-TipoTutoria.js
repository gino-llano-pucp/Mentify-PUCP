'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('TipoTutoria', {
      id_tipoTutoria: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: Sequelize.STRING,
        allowNull: false
      },
      lugar: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fid_tipoObligatoriedad: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'TipoObligatoriedad',
          key: 'id_tipoObligatoriedad'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fid_tipoPermanencia: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'TipoPermanencia',
          key: 'id_tipoPermanencia'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fid_tipoTutor: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'TipoTutor',
          key: 'id_tipoTutor'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      fid_tipoFormato: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'TipoFormato',
          key: 'id_tipoFormato'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('TipoTutoria');
  }
};
