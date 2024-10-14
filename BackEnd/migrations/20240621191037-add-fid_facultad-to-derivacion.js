'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Derivacion', 'fid_facultad', {
      type: Sequelize.INTEGER,
      allowNull: true, // Or false, depending on your requirements
      references: {
        model: 'Facultad',
        key: 'id_facultad' // Adjust this to match the primary key of your Facultad table
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Derivacion', 'fid_facultad');
  }
};
