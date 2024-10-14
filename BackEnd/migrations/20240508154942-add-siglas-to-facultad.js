'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('Facultad', 'siglas', {
      type: Sequelize.STRING(10),
      allowNull: true
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('Facultad', 'siglas');
  }
};
