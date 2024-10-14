'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.addColumn('Notificaciones', 'fechaHoraInicio', {
            type: Sequelize.DATE,
            allowNull: true
        });
        await queryInterface.addColumn('Notificaciones', 'fechaHoraFin', {
            type: Sequelize.DATE,
            allowNull: true
        });
        await queryInterface.addColumn('Notificaciones', 'modalidad', {
            type: Sequelize.STRING,
            allowNull: true
        });
        await queryInterface.addColumn('Notificaciones', 'lugar', {
            type: Sequelize.STRING,
            allowNull: true
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.removeColumn('Notificaciones', 'fechaHoraInicio');
        await queryInterface.removeColumn('Notificaciones', 'fechaHoraFin');
        await queryInterface.removeColumn('Notificaciones', 'modalidad');
        await queryInterface.removeColumn('Notificaciones', 'lugar');
    }
};
