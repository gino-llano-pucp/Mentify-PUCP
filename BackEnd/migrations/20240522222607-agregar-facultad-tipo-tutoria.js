'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('TipoTutoria', 'fid_facultad', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'Facultad',
        key: 'id_facultad'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('TipoTutoria', 'fid_facultad');
  }
};
