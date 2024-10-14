'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.addColumn('EncuestaMaestra', 'fid_facultad', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Facultad',
        key: 'id_facultad'
      }
    });
    
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
    
    await queryInterface.removeColumn('EncuestaMaestra', 'fid_facultad');
    
    await queryInterface.sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
  }
};
