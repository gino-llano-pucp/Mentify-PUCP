'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('SesionCita', {
      id_cita: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      fid_tutor: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_alumno: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_tipo_tutoria: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fid_resultado: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fid_derivacion: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      fid_tipo_modalidad: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      lugar_link: {
        type: Sequelize.STRING,
        allowNull: true
      },
      fid_estado_cita: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.dropTable('SesionCita');
  }
};
