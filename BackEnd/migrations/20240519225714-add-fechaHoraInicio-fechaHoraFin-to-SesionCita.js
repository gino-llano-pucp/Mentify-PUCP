'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.addColumn('SesionCita', 'fechaHoraInicio', {
            type: Sequelize.DATE,
            allowNull: false
        });
        await queryInterface.addColumn('SesionCita', 'fechaHoraFin', {
            type: Sequelize.DATE,
            allowNull: false
        });
    },

    async down(queryInterface, Sequelize) {
        await queryInterface.removeColumn('SesionCita', 'fechaHoraInicio');
        await queryInterface.removeColumn('SesionCita', 'fechaHoraFin');
    }
};