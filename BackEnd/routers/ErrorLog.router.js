const express = require('express');
const router = express.Router();
const ErrorLogController = require('../controllers/ErrorLogController');
const { verifyToken } = require('../middleware/authMiddleware');

// Apply the middleware only to these routes
router.use(verifyToken);

// Route to get all error logs with pagination
router.post('/listar-paginacion', ErrorLogController.listarPaginacion);

module.exports = router;
