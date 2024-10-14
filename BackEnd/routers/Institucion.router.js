const express = require('express');
const router = express.Router();
const InstitucionController = require('../controllers/InstitucionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.use(verifyToken);

// Ruta para listar datos de la institucion
router.get('/', InstitucionController.listar);

// Ruta para editar o crear una institución
router.put('/:id', InstitucionController.editar);



module.exports = router;
