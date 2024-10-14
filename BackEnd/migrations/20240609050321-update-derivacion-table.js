'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Derivacion', 'es_activo', 'esActivo');

    await queryInterface.removeColumn('Derivacion', 'documento');
    await queryInterface.addColumn('Derivacion', 'fid_tipoTutoria', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'TipoTutoria',
        key: 'id_tipoTutoria'
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE'
    });

    await queryInterface.addColumn('Derivacion', 'motivo', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Derivacion', 'antecedentes', {
      type: Sequelize.STRING,
      allowNull: true
    });

    await queryInterface.addColumn('Derivacion', 'comentarios', {
      type: Sequelize.STRING,
      allowNull: true
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.renameColumn('Derivacion', 'esActivo', 'es_activo');

    await queryInterface.addColumn('Derivacion', 'documento', {
      type: Sequelize.BLOB,
      allowNull: true
    });

    await queryInterface.removeColumn('Derivacion', 'fid_tipoTutoria');
    await queryInterface.removeColumn('Derivacion', 'motivo');
    await queryInterface.removeColumn('Derivacion', 'antecedentes');
    await queryInterface.removeColumn('Derivacion', 'comentarios');
  }
};
