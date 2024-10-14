const express = require('express');
const router = express.Router();
const TipoPermanenciaController = require('../controllers/TipoPermanenciaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear un TipoPermanencia
router.post('/', TipoPermanenciaController.createTipoPermanencia);

// Ruta para listar todos los TipoPermanencia
router.get('/', TipoPermanenciaController.getAllTipoPermanencias);

// Ruta para obtener un TipoPermanencia por id
router.get('/:id', TipoPermanenciaController.getTipoPermanenciaById);

// Ruta para actualizar un TipoPermanencia
router.put('/:id', TipoPermanenciaController.updateTipoPermanencia);

// Ruta para eliminar (lógicamente) un TipoPermanencia
router.delete('/:id', TipoPermanenciaController.deleteLogicalTipoPermanencia);

module.exports = router;
