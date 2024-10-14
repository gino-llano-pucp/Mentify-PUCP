const express = require('express');
const router = express.Router();
const TipoTutorController = require('../controllers/TipoTutorController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear un TipoTutor
router.post('/', TipoTutorController.createTipoTutor);

// Ruta para listar todos los TipoTutor
router.get('/', TipoTutorController.getAllTipoTutores);

// Ruta para obtener un TipoTutor por id
router.get('/:id', TipoTutorController.getTipoTutorById);

// Ruta para actualizar un TipoTutor
router.put('/:id', TipoTutorController.updateTipoTutor);

// Ruta para eliminar (lógicamente) un TipoTutor
router.delete('/:id', TipoTutorController.deleteLogicalTipoTutor);

module.exports = router;
