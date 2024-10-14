'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('ErrorLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      fid_usuario: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Usuario',
          key: 'id_usuario'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      errorType: {
        type: Sequelize.STRING,
        allowNull: false
      },
      errorMessage: {
        type: Sequelize.TEXT,
        allowNull: false
      },
      stackTrace: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      endpoint: {
        type: Sequelize.STRING,
        allowNull: true
      },
      method: {
        type: Sequelize.STRING,
        allowNull: true
      },
      params: {
        type: Sequelize.JSON,
        allowNull: true
      },
      timestamp: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('ErrorLogs');
  }
};
