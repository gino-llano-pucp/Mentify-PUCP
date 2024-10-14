'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Usuario', 'fid_facultad', {
      type: Sequelize.INTEGER,
      allowNull: true,  // Puede ser null porque no todos los usuarios tienen que estar asociados a una facultad.
      references: {
        model: 'Facultad',  // Asegúrate de que el nombre del modelo sea el correcto según tu base de datos.
        key: 'id_facultad'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'  // Si se elimina la facultad, se establece null en la referencia.
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Usuario', 'fid_facultad');
  }
};
