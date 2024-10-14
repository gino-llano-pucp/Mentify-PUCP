'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.changeColumn('CompromisoCita', 'fid_estado_compromiso', {
      type: Sequelize.INTEGER,
      allowNull: true
    });

    await queryInterface.addConstraint('CompromisoCita', {
      fields: ['fid_estado_compromiso'],
      type: 'foreign key',
      name: 'fk_compromiso_cita_estado_compromiso',
      references: {
        table: 'EstadoCompromisoCita',
        field: 'id_estado_compromiso'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('CompromisoCita', 'fk_compromiso_cita_estado_compromiso');

    await queryInterface.changeColumn('CompromisoCita', 'fid_estado_compromiso', {
      type: Sequelize.INTEGER,
      allowNull: false
    });
  }
};
