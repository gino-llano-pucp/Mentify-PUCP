'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Eliminar tablas existentes
    await queryInterface.dropTable('Respuesta');
    await queryInterface.dropTable('Opcion');
    await queryInterface.dropTable('Pregunta');

    // Crear nueva tabla Pregunta
    await queryInterface.createTable('Pregunta', {
      id_pregunta: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      enunciado: {
        type: Sequelize.STRING,
        allowNull: false
      },
      es_rspta_unica: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      timestamps: true,
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion'
    });

    // Crear nueva tabla Opcion
    await queryInterface.createTable('Opcion', {
      id_opcion: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fid_pregunta: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Pregunta',
          key: 'id_pregunta'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      enunciado: {
        type: Sequelize.STRING,
        allowNull: false
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      timestamps: true,
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion'
    });

    // Crear nueva tabla Respuesta
    await queryInterface.createTable('Respuesta', {
      id_respuesta: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      fid_encuesta: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Encuesta',
          key: 'id_encuesta'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      fid_opcion: {
        type: Sequelize.INTEGER,
        references: {
          model: 'Opcion',
          key: 'id_opcion'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      esActivo: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      fechaCreacion: {
        type: Sequelize.DATE,
        allowNull: true
      },
      fechaActualizacion: {
        type: Sequelize.DATE,
        allowNull: true
      }
    }, {
      timestamps: true,
      createdAt: 'fechaCreacion',
      updatedAt: 'fechaActualizacion'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Eliminar nuevas tablas creadas
    await queryInterface.dropTable('Respuesta');
    await queryInterface.dropTable('Opcion');
    await queryInterface.dropTable('Pregunta');

    // Aquí puedes volver a crear las tablas anteriores si es necesario
  }
};
