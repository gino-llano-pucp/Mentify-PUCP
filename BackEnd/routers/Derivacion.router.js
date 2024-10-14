const express = require('express');
const router = express.Router();
const DerivacionController = require('../controllers/DerivacionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Ruta para listar derivaciones con paginación
router.post('/listar', DerivacionController.listarDerivaciones);

// Ruta para editar una derivación
router.put('/editar/:id', DerivacionController.editarDerivacion);


// Ruta para registrar una derivación
router.post('/registrar', DerivacionController.registrarDerivacion);

// Ruta para listar derivaciones por tutor
router.post('/listar-por-tutor/:idTutor', DerivacionController.listarDerivacionesPorTutor);


module.exports = router;
