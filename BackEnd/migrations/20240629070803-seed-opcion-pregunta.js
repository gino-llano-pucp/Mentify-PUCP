'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Inserción de preguntas
    await queryInterface.bulkInsert('Pregunta', [
      {
        enunciado: '¿Qué tan útil encontraste las sesiones de tutoría?',
        es_rspta_unica: true,
        esActivo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        enunciado: '¿Cómo calificarías la claridad de las explicaciones proporcionadas durante las sesiones de tutoría?',
        es_rspta_unica: true,
        esActivo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        enunciado: '¿La sesiones de tutoría cumplieron con tus expectativas?',
        es_rspta_unica: true,
        esActivo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      },
      {
        enunciado: '¿Los tutores mostraron interés en tus necesidades y preocupaciones durante las sesiones?',
        es_rspta_unica: true,
        esActivo: true,
        fechaCreacion: new Date(),
        fechaActualizacion: new Date()
      }
    ], {});

    // Inserción de opciones para la primera pregunta
    await queryInterface.bulkInsert('Opcion', [
      { fid_pregunta: 1, enunciado: 'Nada útil', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 1, enunciado: 'Poco útil', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 1, enunciado: 'Útil', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 1, enunciado: 'Muy útil', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 1, enunciado: 'Demasiado útil', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }
    ], {});

    // Inserción de opciones para la segunda pregunta
    await queryInterface.bulkInsert('Opcion', [
      { fid_pregunta: 2, enunciado: '1', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 2, enunciado: '2', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 2, enunciado: '3', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 2, enunciado: '4', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 2, enunciado: '5', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }
    ], {});

    // Inserción de opciones para la tercera pregunta
    await queryInterface.bulkInsert('Opcion', [
      { fid_pregunta: 3, enunciado: 'Sí', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 3, enunciado: 'Parcialmente', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 3, enunciado: 'No', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }
    ], {});

    // Inserción de opciones para la cuarta pregunta
    await queryInterface.bulkInsert('Opcion', [
      { fid_pregunta: 4, enunciado: 'Sí', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 4, enunciado: 'Parcialmente', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() },
      { fid_pregunta: 4, enunciado: 'No', esActivo: true, fechaCreacion: new Date(), fechaActualizacion: new Date() }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Opcion', null, {});
    await queryInterface.bulkDelete('Pregunta', null, {});
  }
};
