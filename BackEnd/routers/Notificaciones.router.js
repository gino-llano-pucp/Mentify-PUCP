const express = require('express');
const notificationController = require('../controllers/NotificacionController');
const { verifyToken } = require('../middleware/authMiddleware');
const router = express.Router();

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para obtener notificaciones de un usuario
router.get('/', notificationController.getUserNotifications);

// Ruta para marcar notificaciones como leídas
router.put('/mark-as-read', notificationController.markAsRead);

module.exports = router;
