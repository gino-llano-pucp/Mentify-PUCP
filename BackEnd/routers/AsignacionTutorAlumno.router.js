const express = require('express');
const router = express.Router();
const AsignacionTutorAlumnoController = require('../controllers/AsignacionTutorAlumnoController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

// Ruta para asignar Tipo de Tutoría a un Alumno
router.post('/asignar-tipo-tutoria-alumno', AsignacionTutorAlumnoController.asignarTutorAlumno);

// Ruta para crear una AsignacionTutorAlumno
router.post('/', AsignacionTutorAlumnoController.createAsignacionTutorAlumno);

// Ruta para obtener la lista de tutores de un tipo de tutoría específico de un alumno
router.get('/listar-tutores-alumno-tipoTutoria/',AsignacionTutorAlumnoController.listTutoresPorTipoTutoriaYAlumnoPaginado);

// Ruta para listar todas las AsignacionTutorAlumno
router.get('/', AsignacionTutorAlumnoController.getAllAsignacionTutorAlumnos);

// Ruta para obtener una AsignacionTutorAlumno por id
router.get('/:id', AsignacionTutorAlumnoController.getAsignacionTutorAlumnoById);



// Ruta para actualizar una AsignacionTutorAlumno
router.put('/:id', AsignacionTutorAlumnoController.updateAsignacionTutorAlumno);

// Ruta para eliminar (lógicamente) una AsignacionTutorAlumno
router.delete('/:id', AsignacionTutorAlumnoController.deleteLogicalAsignacionTutorAlumno);

// Nueva ruta para asignar varios alumnos a una tutoría
router.post('/asignar-varios-alumnos', AsignacionTutorAlumnoController.assignMultipleStudentsToTutoria);

// Nueva ruta para listar usuarios por tipo de tutoría con paginación
router.post('/listar-usuarios-por-tutoria/:page', AsignacionTutorAlumnoController.listUsersByTutoriaPaginated);

// Ruta para insertar alumnos masivamente a la tabla asignacion tutor alumno, con su tipo de tutoria
router.post('/asignarAlumnosTipoTutoria', AsignacionTutorAlumnoController.asignarAlumnosMasivoTipoTutoria);

// Ruta que devuelve los usuarios segun los codigos entregados
router.post('/listarAlumnosPorCodigo', AsignacionTutorAlumnoController.buscarGrupoDeAlumnosPorCodigo);

// Ruta para listar a los alumnos asignados a un Tutor
router.post('/listarAlumnosAsignados', AsignacionTutorAlumnoController.getAlumnosAsignados);


// Ruta para listar tipos de tutoría asignados
router.post('/listar-tipos-tutoria-asignados', AsignacionTutorAlumnoController.listarTiposTutoriaAsignados);


module.exports = router;
