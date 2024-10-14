const express = require('express');
const router = express.Router();
const EstadoSolicitudTutorFijoController = require('../controllers/EstadoSolicitudTutorFijoController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear un EstadoSolicitudTutorFijo
router.post('/', EstadoSolicitudTutorFijoController.createEstadoSolicitudTutorFijo);

// Ruta para listar todos los EstadoSolicitudTutorFijo
router.get('/', EstadoSolicitudTutorFijoController.getAllEstadoSolicitudTutorFijos);

// Ruta para obtener un EstadoSolicitudTutorFijo por id
router.get('/:id', EstadoSolicitudTutorFijoController.getEstadoSolicitudTutorFijoById);

// Ruta para actualizar un EstadoSolicitudTutorFijo
router.put('/:id', EstadoSolicitudTutorFijoController.updateEstadoSolicitudTutorFijo);

// Ruta para eliminar (lógicamente) un EstadoSolicitudTutorFijo
router.delete('/:id', EstadoSolicitudTutorFijoController.deleteLogicalEstadoSolicitudTutorFijo);

module.exports = router;
