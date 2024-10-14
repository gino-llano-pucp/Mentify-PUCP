const express = require('express');
const router = require('express').Router();
const DisponibilidadController = require('../controllers/DisponibilidadController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear una Disponibilidad
router.post('/', DisponibilidadController.createOrUpdateDisponibilidad);

// Ruta para listar todas las Disponibilidades del tutor (sin pasar su ID)
router.get('/', DisponibilidadController.getDisponibilidades);

// Ruta para listar las Disponibilidades por tutor
router.post('/get-by-id', DisponibilidadController.getById);

// Ruta para actualizar Disponibilidad
router.post('/update', DisponibilidadController.update);

// Rutapara eliminar Disponibilidad
router.post('/delete', DisponibilidadController.deleteLogical);

// Ruta para listar todas las Disponibilidades DE UN  tutor (pasando su ID)
router.post('/disponibilidadTutor', DisponibilidadController.obtenerDisponibilidadTutor)

module.exports = router;
