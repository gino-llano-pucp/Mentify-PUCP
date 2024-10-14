const express = require('express');
const router = express.Router();
const SolicitudTutorFijoController = require('../controllers/SolicitudTutorFijoController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear una SolicitudTutorFijo
router.post('/', SolicitudTutorFijoController.createSolicitudTutorFijo);
router.post('/responderSolicitud', SolicitudTutorFijoController.respondToSolicitudTutorFijo);

// Ruta para listar todas las SolicitudTutorFijo
router.get('/', SolicitudTutorFijoController.getAllSolicitudTutorFijos);

// Ruta para obtener una SolicitudTutorFijo por id
router.get('/:id', SolicitudTutorFijoController.getSolicitudTutorFijoById);

// Ruta para actualizar una SolicitudTutorFijo
router.put('/:id', SolicitudTutorFijoController.updateSolicitudTutorFijo);

// Ruta para eliminar (lógicamente) una SolicitudTutorFijo
router.delete('/:id', SolicitudTutorFijoController.deleteLogicalSolicitudTutorFijo);

// Ruta para paginar solicitudes por coordinador
router.post('/paginado-por-coordinador/:page', SolicitudTutorFijoController.getSolicitudesPaginadoPorCoordinador);

module.exports = router;
