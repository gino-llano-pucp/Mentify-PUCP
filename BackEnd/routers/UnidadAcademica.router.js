const express = require('express');
const router = express.Router();
const UnidadAcademicaController = require('../controllers/UnidadAcademicaController');
const { verifyToken } = require('../middleware/authMiddleware');

//   Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para registrar una nueva Unidad Académica
router.post('/register', UnidadAcademicaController.crearUnidadAcademica);

// Ruta para obtener todas las Unidades Académicas
router.get('/listar-todos', UnidadAcademicaController.obtenerTodos);

// Ruta para obtener una Unidad Académica por ID
router.get('/:id', UnidadAcademicaController.obtenerPorId);

// Ruta para la paginacion de unidades academicas
router.post('/listar-paginacion/:page', UnidadAcademicaController.listarPaginacion);

router.post('/carga-masiva-unidades-academicas', UnidadAcademicaController.cargaMasivaUnidadesAcademicas)

// Route to logically delete an academic unit
router.post('/delete', UnidadAcademicaController.deleteUnidadAcademica);

// Route to edit an academic unit
router.post('/edit', UnidadAcademicaController.editUnidadAcademica);

//ruta para activar unidad academica
router.post('/activar', UnidadAcademicaController.activarUnidadAcademica);

module.exports = router;
