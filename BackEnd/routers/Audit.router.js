const express = require('express');
const router = express.Router();
const AuditController = require('../controllers/AuditController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

router.post('/listar', AuditController.obtenerLogs);

module.exports = router;
