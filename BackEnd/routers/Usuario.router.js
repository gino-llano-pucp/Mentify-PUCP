const express = require('express');
const router = require('express').Router();
const UsuarioController = require('../controllers/UsuarioController')
const { verifyToken, refreshToken, verifyTokenAdmin, verifyTokenCoordAdmin } = require('../middleware/authMiddleware');
const Usuario = require('../models/Usuario');
const multer = require('multer');
const upload = multer(); // Configuración de multer

// Ruta para obtener usuarios que son exclusivamente tutores y están activos
router.post('/tutores-exclusivos-activos', UsuarioController.obtenerExclusivamenteTutoresNoCoordinadores); //obtenerExclusivamenteTutoresActivos

//actualizar por id
router.put('/:id', verifyToken, UsuarioController.actualizar);

//obtener por id
//router.get('/:id', UsuarioController.obtenerPorId);

//eliminar
router.delete('/:id', verifyToken, UsuarioController.eliminar);

// Ruta para registrar un nuevo usuario
router.post('/register', verifyToken, UsuarioController.crearUsuario);

// Ruta para obtener todos los usuarios
router.get('/listar-todos', verifyTokenCoordAdmin, UsuarioController.obtenerTodos);

// Rutas no necesarias para el proyecto, se usan el google-auth.router.js y local-auth.router.js
router.post('/login',UsuarioController.login);

router.get('/home', verifyToken, UsuarioController.obtenerInicio);//NO SE USA

router.post('/refresh-token', refreshToken);

// Listar usuarios por tipo de Rol
router.get('/rol/:nombreRol', verifyTokenCoordAdmin, UsuarioController.obtenerUsuariosPorRol);

// Ruta para obtener los roles de un usuario específico por su ID
router.get('/:id/roles', UsuarioController.obtenerRolesUsuario);

router.post('/cargaMasiva', verifyTokenCoordAdmin, UsuarioController.cargarMasivamente)

router.get('/:userId/roles', verifyTokenCoordAdmin, UsuarioController.getUserRoles);

// Ruta para eliminar un rol específico de un usuario
router.delete('/:id/role/:roleId', verifyToken, UsuarioController.eliminarRolDeUsuario);

// Ruta para eliminar un rol específico de un usuario por nombre de rol
router.delete('/:id/role-name/:roleName', verifyToken, UsuarioController.eliminarRolDeUsuarioPorNombre);

//Ruta para activar un rol específico de un usuario por nombre de rol
router.put("/:id/role-name/:roleName",  verifyToken, UsuarioController.activarRolDeUsuarioPorNombre);

// Ruta para paginacion de usuarios por rol
router.post('/listar-usuarios-por-rol-paginado/:page', verifyToken, UsuarioController.listarUsuariosPorRolPaginado);

// Ruta para obtener usuarios para asignar a un tipo de tutoria (con sus validaciones)
router.post('/listarUsuariosPorCoordinador', verifyToken, UsuarioController.getUsuariosPorCoordinador);

// Nueva ruta para listar usuarios por tipo de tutoría
router.post('/listarUsuariosPorTipoTutoria', verifyToken, UsuarioController.getUsuariosPorTipoTutoria);

// ej

// Ruta para listar usuarios por facultad de forma paginada
router.post('/listar-usuarios-facultad-paginado/:page', verifyToken, UsuarioController.listarUsuariosFacultadPaginado);

// Ruta para paginacion de usuarios por coordinador
router.post('/listar-usuarios-por-coordinador-paginado/:page', verifyToken, UsuarioController.listarUsuariosPorCoordinadorPaginado);


// Ruta para listar tutores del alumno con paginación y búsqueda por nombre
router.post('/tutores-alumno/:idAlumno', verifyToken, UsuarioController.listarTutoresAlumnoPaginado);

// Ruta para listar tutores por tipo de tutoría con paginación
router.post('/tutores-tipo-tutoria', verifyToken, UsuarioController.listarTutoresPorTipoTutoriaPaginado);

// Ruta para listar alumnos asignados al tutor del tipo de tutoría seleccionado con paginación
router.post('/alumnos-asignados-tutor', verifyToken, UsuarioController.listarAlumnosAsignadosTutor);

// Ruta para listar alumnos del tipo de tutoría seleccionado, excluyendo los asignados al tutor con paginación
router.post('/alumnos-tipo-tutoria-excluidos', verifyToken, UsuarioController.listarAlumnosTipoTutoriaExcluidos);

// Ruta para asignar alumno al tutor para el tipo de tutoría
router.post('/asignar-alumno-tutor', verifyToken, UsuarioController.asignarAlumnoTutor);

// Ruta para desasignar alumno del tutor para el tipo de tutoría
router.post('/desasignar-alumno-tutor', verifyToken, UsuarioController.desasignarAlumnoTutor);

// Ruta para cargar masivamente alumnos al tipo de tutoría
router.post('/cargar-masivamente-alumnos-tutoria', verifyToken, UsuarioController.cargarMasivamenteAlumnosTutoria);

// Ruta para reiniciar temporales (vaciar alumnos asociados a un tipo de tutoría temporal)
router.post('/reiniciar-temporales', verifyToken, UsuarioController.reiniciarTemporales);

// Ruta para obtener los tutores para asignacion de solicitudes
router.post('/buscar-tutores', verifyToken, UsuarioController.buscarTutores);

//--

// Ruta para listar tutores asignados y solicitudes de tutor pendientes
router.post('/listar-tutores-y-solicitudes', verifyToken, UsuarioController.listarTutoresYSolicitudes);

// Ruta para enviar correo al alumno cuando su solicitud de tutor sea rechazada
router.post('/enviar-correo-rechazo', verifyToken, UsuarioController.enviarCorreoRechazo);

// Ruta para cargar lista de usuarios a un tipo de tutoría
router.post('/cargar-usuarios-tutoria', verifyToken, UsuarioController.cargarUsuariosTutoria);

router.post('/listar-alumnosAsigandos-tutor/:id', verifyToken, UsuarioController.listarAlumnosAsiganadosTutorFijo);

//Ruta para obtemer los tipos de tutoria por tutor
router.post('/listarTiposTutoriaPorTutor', verifyToken, UsuarioController.listarTiposTutoriaPorTutor);

// Ruta para listar alumnos que pertenecen a un tipo de tutoría pero no están asignados a un tutor específico
router.post('/listar-alumnos-tutoria-sin-tutor', verifyToken, UsuarioController.listarAlumnosTutoriaSinTutor);

// Ruta para registrar un responsable de tutoría
router.post('/registrar-responsable-tutoria', verifyToken, UsuarioController.registrarResponsableTutoria);

// Ruta para listar un responsable de tutoría
router.get('/listar-responsable-tutoria', verifyToken, UsuarioController.listarResponsableTutoria);

// Ruta para editar un responsable de tutoría
router.post('/editar-responsable-tutoria', verifyTokenAdmin, UsuarioController.editarResponsableTutoria);

// Ruta para eliminar un responsable de tutoría
router.post('/eliminar-responsable-tutoria', verifyTokenAdmin, UsuarioController.eliminarResponsableTutoria);

// Ruta para eliminar un responsable de tutoría
router.post("/activar-responsable-tutoria",verifyTokenAdmin,UsuarioController.activarResponsableTutoria);
//activar-responsable-tutoria

// API para agregar el rol de tutor a un alumno
router.post('/agregar-rol-tutor', verifyToken, UsuarioController.agregarRolTutor);

// API para desactivar el rol de tutor a un alumno
router.post('/desactivar-rol-tutor', verifyToken, UsuarioController.desactivarRolTutor);

// API para agregar el rol de alumno a un tutor
router.post('/agregar-rol-alumno', verifyToken, UsuarioController.agregarRolAlumno);

// API para desactivar el rol de alumno a un tutor
router.post('/desactivar-rol-alumno', verifyToken, UsuarioController.desactivarRolAlumno);

// Ruta para asignar usuario al tipo de tutoría por rol
router.post('/asignar-usuario-tipo-tutoria', verifyToken, UsuarioController.asignarUsuarioTipoTutoriaPorRol);

// Ruta para filtrar usuarios por codigo y Rol
router.post('/listar-usuarios-por-codigo', verifyToken, UsuarioController.listarUsuariosPorCodigoRol);
//se verifica tambien, si el Rol es erroneo (de lo que se envia) o no existe se obvia

//Ruta para verificar Alumnos en la subida del Historico de Notas como ZIP
router.post("/verificar-alumnos-historico-notas", verifyToken, upload.any(), UsuarioController.verificarAlumnosHistoricoNotas);

// Ruta para manejar el restablecimiento de la contraseña
router.post('/handle-password-reset', UsuarioController.handlePasswordReset);


//Ruta para cargar masivamente las notas de los Alumnos (en formato BLOB)
router.post("/carga-masiva-notas-alumnos", verifyToken, UsuarioController.cargarMasivamenteNotasAlumnos);
//El guardado de las notas esta funcionando, hay que verificar comom recibir desde front el dato. Pregunten a chatgpt



//Ruta para listar alumnos para encuestas
router.post("/listado-alumnos-encuesta", verifyToken, UsuarioController.listadoAlumnosEncuesta);

//ruta para mandar una derivacion
router.post("/registrar-derivacion", verifyToken, UsuarioController.registrarDerivacion);

//ruta para verificar si ya fue derivado
router.post("/obtener-derivacion-detalle", verifyToken, UsuarioController.obtenerDerivacionDetalle);

//Ruta para listar derivaciones
router.post("/listar-derivaciones", verifyToken, UsuarioController.listarDerivaciones);

//Ruta para enviar derivacion
router.post("/enviar-derivacion", verifyToken, UsuarioController.enviarDerivacion);

// Ruta para obtener todas las Facultades disponibles
router.get('/listar-facultades-disponibles', verifyToken, UsuarioController.obtenerFacultadesDisponibles);

module.exports = router;