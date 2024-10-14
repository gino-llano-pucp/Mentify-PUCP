const express = require('express');
const router = express.Router();
const TipoFormatoController = require('../controllers/TipoFormatoController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear un TipoFormato
router.post('/', TipoFormatoController.createTipoFormato);

// Ruta para listar todos los TipoFormato
router.get('/', TipoFormatoController.getAllTipoFormatos);

// Ruta para obtener un TipoFormato por id
router.get('/:id', TipoFormatoController.getTipoFormatoById);

// Ruta para actualizar un TipoFormato
router.put('/:id', TipoFormatoController.updateTipoFormato);

// Ruta para eliminar (lógicamente) un TipoFormato
router.delete('/:id', TipoFormatoController.deleteLogicalTipoFormato);

module.exports = router;
