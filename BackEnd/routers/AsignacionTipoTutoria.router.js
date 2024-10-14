const express = require('express');
const router = express.Router();
const AsignacionTipoTutoriaController = require('../controllers/AsignacionTipoTutoriaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para asignar Tipo de Tutoría a un Tutor
router.post('/asignar-tipo-tutoria-tutor', AsignacionTipoTutoriaController.asignarTipoTutoriaATutor);
router.post('/listar-tipoTutoria-tutor/:page', AsignacionTipoTutoriaController.listarTiposTutoriaPorTutor);

// Ruta para listar tipos de tutoría individuales
router.post('/listar-tipoTutoria-individuales/:page', AsignacionTipoTutoriaController.listarTiposTutoriaIndividuales);

router.post('/listar-alumnos-por-tipoTutoria/:page', AsignacionTipoTutoriaController.listarAlumnosPorTipoTutoria);
router.post('/listar-alumnos-todos-por-tipoTutoria/:page', AsignacionTipoTutoriaController.listarAlumnosPorTipoTutoriaTodos);
router.post('/listar-tutores-por-tipoTutoria/:page', AsignacionTipoTutoriaController.listarTutoresPorTipoTutoria);


// Ruta para crear una AsignacionTipoTutoria
router.post('/', AsignacionTipoTutoriaController.createAsignacionTipoTutoria);

// Ruta para listar todas las AsignacionTipoTutoria
router.get('/', AsignacionTipoTutoriaController.getAllAsignacionTipoTutorias);

// Ruta para obtener una AsignacionTipoTutoria por id
router.get('/:id', AsignacionTipoTutoriaController.getAsignacionTipoTutoriaById);

// Ruta para actualizar una AsignacionTipoTutoria
router.put('/:id', AsignacionTipoTutoriaController.updateAsignacionTipoTutoria);

// Ruta para eliminar (lógicamente) una AsignacionTipoTutoria
router.delete('/:id', AsignacionTipoTutoriaController.deleteLogicalAsignacionTipoTutoria);

// Ruta para listar usuarios por tipo de tutoría con paginación
router.post('/listar-usuarios-por-tutoria/:page', AsignacionTipoTutoriaController.listUsersByTutoriaPaginated);

// Ruta para borrar asignación de tipo de tutoría
router.post('/eliminar-asignacion-tipo-tutoria', AsignacionTipoTutoriaController.eliminarAsignacionTipoTutoria);


module.exports = router;
