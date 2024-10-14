'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('HistorialCitas', {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            citaId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'SesionCita', // Asegúrate de que este es el nombre de la tabla para las citas
                    key: 'id_cita'
                }
            },
            fechaHoraInicio: {
                type: Sequelize.DATE,
                allowNull: true
            },
            fechaHoraFin: {
                type: Sequelize.DATE,
                allowNull: true
            },
            tipoModalidad: {
                type: Sequelize.STRING,
                allowNull: true
            },
            lugar: {
                type: Sequelize.STRING,
                allowNull: true
            },
            estado: {
                type: Sequelize.STRING,
                allowNull: true
            },
            usuarioModifico: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: 'Usuario', // Asegúrate de que este es el nombre de la tabla para los usuarios
                    key: 'id_usuario'
                }
            },
            fechaModificacion: {
                type: Sequelize.DATE,
                allowNull: false,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('HistorialCitas');
    }
};
