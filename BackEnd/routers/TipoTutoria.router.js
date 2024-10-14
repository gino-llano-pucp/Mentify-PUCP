const express = require('express');
const router = express.Router();
const TipoTutoriaController = require('../controllers/TipoTutoriaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para crear un TipoTutoria
router.post('/', TipoTutoriaController.createTipoTutoria);

// Ruta para obtener los tipos de tutoría por facultad
router.get('/tiposTutoria', TipoTutoriaController.getTiposTutoriaByFacultad);


// Ruta para listar todos los tipos de tutoría asignados a un usuario según su rol
router.post('/listar-tipos-tutoria-asignados', TipoTutoriaController.listarTiposTutoriaAsignados);


// Ruta para listar todos los TipoTutoria
router.get('/', TipoTutoriaController.getAllTipoTutorias);

// Ruta para obtener un TipoTutoria por id
router.get('/:id', TipoTutoriaController.getTipoTutoriaById);

// Ruta para actualizar un TipoTutoria
router.put('/:id', TipoTutoriaController.updateTipoTutoria);

// Ruta para eliminar (lógicamente) un TipoTutoria
router.delete('/:id', TipoTutoriaController.deleteLogicalTipoTutoria);

// Ruta para listar tipos de tutoria asignados a un coordinador
router.post('/listarTiposTutoria', TipoTutoriaController.getTiposTutoriaPorCoordinador);

// Ruta para agregar un usuario al Tipo de Tutoria
router.post('/agregar-usuario', TipoTutoriaController.agregarUsuarioATipoTutoria);

// Ruta para reiniciar los tipos de tutoría temporales
router.post('/reiniciar-temporales', TipoTutoriaController.reiniciarTemporales);

// Ruta para listar tipos de tutoría asignados a un alumno
router.post('/listar-tipos-tutoria-alumno', TipoTutoriaController.listarTiposTutoriaAlumno);

// Nueva ruta para listar tipos de tutoría según el rol del coordinador
router.post('/listar-tipos-tutoria-coordinador', TipoTutoriaController.listarTiposTutoriaPorCoordinador);

// New route to list types of tutoring according to the coordinator's role
router.post('/listar-tipos-tutoria-reporte', TipoTutoriaController.listarTiposTutoriaReporte);


module.exports = router;
