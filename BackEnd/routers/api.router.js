// api.router.js
//aqui se va combinar todos los sub-routers
const express = require('express');
const router = express.Router();

const routerEstado = require('./EstadoCompromiso.router');
//const routerTipoTutor = require('../bckp/TipoTutor.router');
const routerTipoObligatoriedad = require('./TipoObligatoriedad.Router')
const routerTipoModalidad = require('./TipoModalidad.router')
const routerUsuario = require('./Usuario.router');
const googleAuthRouter = require('./Google-auth.router');
const local = require('./Local-auth.router');
const opcionSidebar = require('./Opciones-Sidebar');
const RolesUsuario = require('./RolesUsuario.router');
const routerFacultad = require('./Facultad.router');
const routerPrograma = require('./Programa.router');
const routerSesionCita = require('./SesionCita.router');
const routerResultadoCita = require('./ResultadoCita.router');

const routerDisponibilidad = require('./Disponibilidad.router');
const routerHistoricoEstudiante = require('./HistoricoEstudiante.router');
const routerUnidadAcademica = require('./UnidadAcademica.router');
const routerTipoTutoria = require('./TipoTutoria.router');

const routerTipoTutor = require('./TipoTutor.router');
const routerTipoFormato = require('./TipoFormato.router');
const routerTipoPermanencia = require('./TipoPermanencia.router');
const routerAsignacionTipoTutoria = require('./AsignacionTipoTutoria.router');
const routerAsignacionTutorAlumno = require('./AsignacionTutorAlumno.router');
const routerEstadoSolicitudTutorFijo = require('./EstadoSolicitudTutorFijo.router');
const routerSolicitudTutorFijo = require('./SolicitudTutorFijo.router');
const routerEncuesta = require("./Encuesta.router");
const routerEstadoEncuesta = require("./EstadoEncuesta.router");

const routerNotificaciones = require("./Notificaciones.router");
const routerEstadoEncuestaMaestra = require("./EstadoEncuestaMaestra.router");
const routerEncuestaMaestra = require("./EncuestaMaestra.router");
const routerAudit = require("./Audit.router");
const routerInstitucion = require("./Institucion.router");
const routerError = require("./ErrorLog.router"); 
const app = express();

//NO OLVIDAR QUE ES UNA RUTA ADICIONAL
router.use('/estados', routerEstado);
router.use('/tipoObligatoriedad', routerTipoObligatoriedad);
router.use('/tipoModalidad', routerTipoModalidad);
router.use('/usuario', routerUsuario);
router.use('/facultad', routerFacultad);
router.use('/programa', routerPrograma);
router.use('/sesionCita', routerSesionCita);

router.use('/disponibilidades', routerDisponibilidad);
router.use('/historicoEstudiante', routerHistoricoEstudiante);

router.use('/unidadAcademica', routerUnidadAcademica);

router.use('/tipoTutoria', routerTipoTutoria);
router.use('/tipoTutor', routerTipoTutor);
router.use('/tipoFormato', routerTipoFormato);
router.use('/tipoPermanencia', routerTipoPermanencia);
router.use('/asignacionTipoTutoria', routerAsignacionTipoTutoria);
router.use('/asignacionTutorAlumno', routerAsignacionTutorAlumno);
router.use('/estadoSolicitud', routerEstadoSolicitudTutorFijo);
router.use('/solicitudTutorFijo', routerSolicitudTutorFijo);
router.use('/resultadoCita',routerResultadoCita);
router.use("/Encuesta", routerEncuesta);
router.use("/EncuestaMaestra", routerEncuestaMaestra);
router.use("/EstadoEncuesta", routerEstadoEncuesta);
router.use("/notifications", routerNotificaciones);
router.use("/EstadoEncuestaMaestra", routerEstadoEncuestaMaestra);
router.use('/audit', routerAudit);
router.use('/institucion', routerInstitucion);
router.use('/error-logs', routerError);

// Conexión del enrutador a Express
app.use(express.json()); // Para manejar JSON
router.use('/', googleAuthRouter); // Conecta el enrutador
router.use('/', local);
router.use('/', opcionSidebar);
router.use('/rolesUsuario', RolesUsuario);

module.exports = router;
