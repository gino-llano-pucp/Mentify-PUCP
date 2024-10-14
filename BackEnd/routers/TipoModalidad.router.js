const express = require('express');
const router = require('express').Router();
const TipoModalidadController = require('../controllers/TipoModalidadController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware de autenticación solo a estas rutas
router.use(verifyToken);

// Ruta para crear un TipoModalidad
router.post('/', TipoModalidadController.createTipoModalidad);

// Ruta para listar todos los TipoModalidad
router.get('/', TipoModalidadController.getAllTipoModalidades);

// Ruta para obtener un TipoModalidad por id
router.get('/:id', TipoModalidadController.getTipoModalidadById);

// Ruta para actualizar un TipoModalidad
router.put('/:id', TipoModalidadController.updateTipoModalidad);

// Ruta para eliminar (lógicamente) un TipoModalidad
router.delete('/:id', TipoModalidadController.deleteLogicalTipoModalidad);

module.exports = router;
