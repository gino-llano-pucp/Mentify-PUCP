const router = require('express').Router();
const SesionCitaController = require('../controllers/SesionCitaController');
const { verifyToken } = require('../middleware/authMiddleware');

// Aplicar el middleware solo a estas rutas
router.use(verifyToken);

router.post('/registrar', SesionCitaController.crearCita);
router.post('/registrarCitaParteAlumno', SesionCitaController.crearCitaAlumno);
router.post('/registrarxTutorIndividual', SesionCitaController.crearCitaXTutorIndividual);
router.post('/registrarxTutorGrupal', SesionCitaController.crearCitaXTutorGrupal);
router.get('/listarCitasTutor', SesionCitaController.listarCitasXTutor);
router.post('/listarCitasTutorMultiUso', SesionCitaController.listarCitasXTutorTokenJson);
router.get('/listarCitasAlumno', SesionCitaController.listarCitasxAlumno);
router.post('/listarCitasAlumnoPorIdJSON', SesionCitaController.listarCitasxAlumnoJSON);
router.post('/registrarxTutor', SesionCitaController.crearCitaXTutorGrupal);
router.post('/editar/:id', SesionCitaController.editarSesionCita);
router.post('/eliminar/:id', SesionCitaController.eliminarSesionCita);
router.post('/registrarCitaGrupal', SesionCitaController.registrarCitaGrupal);
router.post('/obtenerDetalle', SesionCitaController.obtenerDetalleCita);

// Ruta para listar citas por tutor
router.post('/listar-citas', SesionCitaController.listarCitas);

// Listar citas programas del tutor
router.post('/citas-programadas/:page', SesionCitaController.listarCitasProgramadas);
router.post('/citas-finalizadas/:page', SesionCitaController.listarCitasFinalizadas);
router.post('/citas-canceladas/:page', SesionCitaController.listarCitasCanceladas);
//Listar citas del alumno
router.post('/citas-programadas-alumno/:page', SesionCitaController.listarCitasProgramadasAlumno);
router.post('/citas-finalizadas-alumno/:page', SesionCitaController.listarCitasFinalizadasAlumno);
router.post('/citas-canceladas-alumno/:page', SesionCitaController.listarCitasCanceladasAlumno);

// Ruta para obtener estadísticas de citas
router.post('/obtener-estadisticas-citas', SesionCitaController.obtenerEstadisticasCitas);

// Ruta para obtener el reporte de tutor
router.post('/obtener-reporte-tutor', SesionCitaController.obtenerReporteTutor);

// Ruta para obtener el reporte de encuestas
router.post('/obtener-reporte-encuestas', SesionCitaController.obtenerReporteEncuestas);

router.post('/obtener-reporte-alumno', SesionCitaController.obtenerReporteAlumno);

router.post('/obtener-reporte-alumno-para-tutor', SesionCitaController.obtenerReporteAlumnosParaTutor);


module.exports = router;