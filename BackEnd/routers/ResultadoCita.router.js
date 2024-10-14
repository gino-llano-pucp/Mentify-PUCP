const express = require('express');
const router = express.Router();  // Crear una instancia de Router
const ResultadoCitaController = require('../controllers/ResultadoCitaController');
const { verifyToken } = require('../middleware/authMiddleware');  // Asumiendo que tienes un middleware de autenticación




// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

router.post('/registrar', ResultadoCitaController.registrarResultadoCita);

module.exports = router;
