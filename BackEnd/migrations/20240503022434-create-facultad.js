'use strict';

module.exports = {
    up: async (queryInterface, Sequelize) => {
        await queryInterface.createTable('Facultad', {
            id_facultad: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            nombre: {
                type: Sequelize.STRING(100),
                allowNull: true
            },
            fid_usuario: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: 'Usuario', // Esto debe coincidir con el nombre de la tabla de usuarios
                    key: 'id_usuario'
                }
            },
            esActivo: {
                type: Sequelize.TINYINT,
                allowNull: false,
                defaultValue: true
            },
            fechaCreacion: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
            },
            fechaActualizacion: {
                type: Sequelize.DATE,
                allowNull: true,
                defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP')
            }
        });
    },

    down: async (queryInterface, Sequelize) => {
        await queryInterface.dropTable('Facultad');
    }
};