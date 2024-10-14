const express = require('express');
const router = express.Router();
const TipoObligatoriedadController = require('../controllers/TipoObligatoriedadController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear un TipoObligatoriedad
router.post('/', TipoObligatoriedadController.createTipoObligatoriedad);

// Ruta para listar todos los TipoObligatoriedad
router.get('/', TipoObligatoriedadController.getAllTipoObligatoriedades);

// Ruta para obtener un TipoObligatoriedad por id
router.get('/:id', TipoObligatoriedadController.getTipoObligatoriedadById);

// Ruta para actualizar un TipoObligatoriedad
router.put('/:id', TipoObligatoriedadController.updateTipoObligatoriedad);

// Ruta para eliminar (lógicamente) un TipoObligatoriedad
router.delete('/:id', TipoObligatoriedadController.deleteLogicalTipoObligatoriedad);

module.exports = router;
