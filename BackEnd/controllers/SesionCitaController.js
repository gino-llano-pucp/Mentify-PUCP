const SesionCitaServices = require('../services/SesionCitaServices')
const logError = require('../utils/loggingErrors');

const SesionCitaController = {

    async crearSesionCita(req, res){
        const SesionCitaData = req.body;
        try{
            const nuevaSesionCita = await SesionCitaServices.insertarXAlumno(SesionCitaData);
            res.status(201).json({
                message: "Sesion Cita Creada",
                nuevaSesionCita
            });
        }catch(err){
            console.error("Error al insertar Sesion Cita", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async editarSesionCita(req, res){
        const userId = req.user.id;
        const { id } = req.params;
        const SesionCitaData = req.body;
        const performedBy = req.user.id;
        try{
            const nuevaSesionCita = await SesionCitaServices.editarSesionCita(id, SesionCitaData, userId, performedBy);
            res.status(201).json({
                message: "Sesion Cita editada",
                nuevaSesionCita
            });
        }catch(err){
            console.error("Error al editar Sesion Cita", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async listarCitasXTutor(req, res){
        const idTutor = req.user.id;
        
        try{
            const listado = await SesionCitaServices.listarCitasXTutor(idTutor);
            res.status(201).json({
                message: "Listado de Citas con éxito",
                listado
            });
        }catch(err){
            console.error("Error al listar las Citas del tutor", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async listarCitasxAlumno(req, res){
        //el id lo saco del token del usuario
        const idAlumno = req.user.id;

        try{
            const listado = await SesionCitaServices.listarCitasXAlumno(idAlumno);
            res.status(201).json({
                message: "Listado de Citas con éxito",
                listado                             
            });
        }catch(err){
            console.error("Error al listar las Citas del alumno", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async listarCitasxAlumnoJSON(req, res){
        //el id lo saco del token del usuario
        const idAlumno = req.body.idAlumno? req.body.idAlumno : req.user.id;

        try{
            const listado = await SesionCitaServices.listarCitasXAlumno(idAlumno);
            res.status(201).json({
                message: "Listado de Citas con éxito",
                listado                             
            });
        }catch(err){
            console.error("Error al listar las Citas del alumno", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async crearCita(req, res) {
        const citaData = req.body; // Asumiendo que el cuerpo de la solicitud contiene todos los datos necesarios
        const idTutor = req.user.id;
        const performedBy = req.user.id;
        
        console.log("cita data back: ", citaData);

        try {
            // Llamar al servicio para registrar la cita grupal
            const { cita, disponibilidades } = await SesionCitaServices.registrarCita(citaData, idTutor, performedBy);
            console.log("cita creada: ", cita);

            // Enviar una respuesta con estado 201 (Created) indicando que la cita se ha registrado correctamente
            res.status(201).json({
                message: "Sesión de cita  creada con éxito",
                detalles: {
                    id: cita.id_cita,  // Devuelve el ID de la sesión de cita creada
                    disponibilidades // Devuelve el nuevo arreglo total de disponibilidades
                }
            });
        } catch (err) {
            // En caso de error, registrar el error y enviar una respuesta de error
            console.error("Error al registrar la sesión de cita grupal", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            if (err.message === "ERROR NO HAY DISPONIBILIDAD") {
                res.status(400).json({
                    error: {
                        message: err.message
                    }
                });
            } else {
                res.status(500).json({
                    error: {
                        message: 'Internal server error'
                    }
                });
            }
        }
    },
    async  crearCitaXTutorIndividual(req, res) {
        const {idTutor, citaData} = req.body;  // Asumiendo que el cuerpo de la solicitud contiene todos los datos necesarios
        const performedBy = req.user.id;
        console.log("cita data back: ", citaData);

        try {
            // Llamar al servicio para insertar la cita individual
            const sesionCita = await SesionCitaServices.insertarXTutorIndividual(citaData, idTutor, performedBy);
            
            // Enviar una respuesta con estado 201 (Created) indicando que la cita se ha registrado correctamente
            res.status(201).json({
                message: "Sesión de cita creada con éxito",
                detalles: {
                    id: sesionCita.id_cita,  // Devuelve el ID de la sesión de cita creada
                }
            });
        } catch (err) {
            // En caso de error, registrar el error y enviar una respuesta de error
            console.error("Error al insertar la sesión de cita ", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async  crearCitaXTutorGrupal(req, res) {
        const citaData = req.body;  // Asumiendo que el cuerpo de la solicitud contiene todos los datos necesarios
        const performedBy = req.user.id;
        try {
            // Llamar al servicio para insertar la cita grupal
            const resultadoCitaGrupal = await SesionCitaServices.insertarXTutorGrupal(citaData, performedBy);
            
            // Enviar una respuesta con estado 201 (Created) indicando que la cita se ha registrado correctamente
            res.status(201).json({
                message: "Sesión de cita  creada con éxito",
                detalles: resultadoCitaGrupal
            });
        } catch (err) {
            // En caso de error, registrar el error y enviar una respuesta de error
            console.error("Error al insertar la sesión de cita ", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async  obtenerDetalleCita(req, res) {
        const idCita = req.body.idCita;  // Asumiendo que el cuerpo de la solicitud contiene todos los datos necesarios
        
        try {
            // Llamar al servicio para obtener el detalle de cita
            const detalleCita = await SesionCitaServices.obtenerDetalleCita(idCita);
            
            // Enviar una respuesta con estado 201 (Created) indicando que la cita se ha registrado correctamente
            res.status(201).json({
                message: "Detalle de cita con éxito",
                detalles: detalleCita
            });
        } catch (err) {
            // En caso de error, registrar el error y enviar una respuesta de error
            console.error("Error al obtener detalle de la sesión de cita ", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async eliminarSesionCita(req, res) {
        const { id } = req.params;  // Asumiendo que el ID de la cita viene como parámetro en la URL
        const data = req.body;
        const performedBy = req.user.id;
        try {
            const resultado = await SesionCitaServices.cancelarCita(id,data,performedBy);
            res.status(200).json({
                message: "Sesion Cita Eliminada",
                resultado
            });
        } catch (err) {
            console.error("Error al eliminar Sesion Cita", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            if (err.message === 'La cita no existe') {
                res.status(404).json({ error: 'Cita no encontrada' });
            } else {
                res.status(500).json({ error: 'Internal server error' });
            }
        }
    },

    async registrarCitaGrupal(req, res) {
        const citaData = req.body;
        const performedBy = req.user.id;
        try{
            const resultado = await SesionCitaServices.registrarCitaGrupal(citaData, performedBy);
            return res.status(200).json({
                message: 'Cita grupal registrada',
                resultado: resultado
            })
        }
        catch(err){
            console.error(err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            return res.status(500).json({
                message: "Error al registrar cita grupal",
                error: err
            })
        }
    },
    async listarCitas(req, res) {
        const { idTutor, idAlumno, fechaDesde, fechaHasta, idTipoTutoria, page, pageSize, orderBy, sortOrder } = req.body;
    
        try {
          const result = await SesionCitaServices.listarCitas(idTutor, idAlumno, fechaDesde, fechaHasta, idTipoTutoria, page, pageSize, orderBy, sortOrder);
          res.status(200).json({
            message: 'Citas listadas con éxito',
            data: result
          });
        } catch (error) {
          console.error('Error al listar citas:', error);
          await logError(error, req.user.id, req.originalUrl, req.method, req.body);
          res.status(500).json({ error: 'Error interno del servidor' });
        }
    },

    async crearCitaAlumno(req, res) {
        const {idTutor, idTipoTutoria, idAlumno, fechaHoraInicio, fechaHoraFin, modalidad} = req.body;  // Asumiendo que el cuerpo de la solicitud contiene todos los datos necesarios
        const citaData = {idTipoTutoria, idAlumno, fechaHoraInicio, fechaHoraFin, modalidad}
        console.log("cita data back: ", citaData);
        const performedBy = req.user.id;
        try {
            // Llamar al servicio para insertar la cita individual
            const sesionCita = await SesionCitaServices.crearCitaAlumno(citaData, idTutor, performedBy);
            
            // Enviar una respuesta con estado 201 (Created) indicando que la cita se ha registrado correctamente
            res.status(201).json({
                message: "Sesión de cita creada con éxito",
                detalles: {
                    id: sesionCita.id_cita,  // Devuelve el ID de la sesión de cita creada
                }
            });
        } catch (err) {
            // En caso de error, registrar el error y enviar una respuesta de error
            console.error("Error al insertar la sesión de cita", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: err.message });
        }
    },

    
    async obtenerEstadisticasCitas(req, res) {
        const { idFacultad, searchCriteria } = req.body;
    
        try {
            const result = await SesionCitaServices.obtenerEstadisticasCitas(idFacultad, searchCriteria);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error obteniendo estadísticas de citas:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    },
    
    async listarCitasProgramadas(req, res) {
        const idTutor = req.user.id;
        const page = parseInt(req.params.page); 
        const {pageSize = 10, sortBy = 'fechaHoraInicio', sortOrder = 'ASC' } = req.query;
    
        try {
            const resultado = await SesionCitaServices.listarCitasProgramadas({
                idTutor,
                page,
                pageSize,
                sortBy,
                sortOrder
            });
    
            res.status(200).json({
                message: 'Citas programadas listadas con éxito',
                data: resultado
            });
        } catch (err) {
            console.error("Error al listar las citas programadas", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);    
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async obtenerReporteTutor(req, res) {
        try {
          const { idCoordinador, searchCriteria } = req.body;
          const reporte = await SesionCitaServices.obtenerReporteTutor(idCoordinador, searchCriteria);
          res.status(200).json(reporte);
        } catch (error) {
            console.error('Error al obtener reporte de tutor:', error.message);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
          res.status(500).json({ error });
        }
    },
    async obtenerReporteEncuestas(req, res) {
        const { idCoordinador, searchCriteria } = req.body;
    
        try {
            const result = await SesionCitaServices.obtenerReporteEncuestas(idCoordinador, searchCriteria);
            res.status(200).json(result);
        } catch (error) {
            console.error('Error obteniendo reporte de encuestas:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error });
        }
    }
    
    ,
    async listarCitasFinalizadas(req, res) {
        const idTutor = req.user.id;
        
        const page = parseInt(req.params.page); 
        const {pageSize = 10, sortBy = 'fechaHoraInicio', sortOrder = 'DESC' } = req.query;
    
        try {
            const resultado = await SesionCitaServices.listarCitasFinalizadas({
                idTutor,
                page,
                pageSize,
                sortBy,
                sortOrder
            });
    
            res.status(200).json({
                message: 'Citas finalizadas listadas con éxito',
                data: resultado
            });
        } catch (err) {
            console.error("Error al listar las citas finalizadas", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async listarCitasCanceladas(req, res) {
        const idTutor = req.user.id;
        const page = parseInt(req.params.page); 
        const {pageSize = 10, sortBy = 'fechaHoraInicio', sortOrder = 'DESC' } = req.query;
    
        try {
            const resultado = await SesionCitaServices.listarCitasCanceladas({
                idTutor,
                page,
                pageSize,
                sortBy,
                sortOrder
            });
    
            res.status(200).json({
                message: 'Citas canceladas listadas con éxito',
                data: resultado
            });
        } catch (err) {
            console.error("Error al listar las citas canceladas", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);   
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async listarCitasProgramadasAlumno(req, res) {
        const idAlumno = req.user.id;
        
        const page = parseInt(req.params.page); 
        const {pageSize = 10, sortBy = 'fechaHoraInicio', sortOrder = 'DESC' } = req.query;
    
        try {
            const resultado = await SesionCitaServices.listarCitasProgramadasAlumno({
                idAlumno,
                page,
                pageSize,
                sortBy,
                sortOrder
            });
    
            res.status(200).json({
                message: 'Citas programadas listadas con éxito',
                data: resultado
            });
        } catch (err) {
            console.error("Error al listar las citas programadas", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async listarCitasFinalizadasAlumno(req, res) {
        const idAlumno = req.user.id;
        
        const page = parseInt(req.params.page); 
        const {pageSize = 10, sortBy = 'fechaHoraInicio', sortOrder = 'DESC' } = req.query;
    
        try {
            const resultado = await SesionCitaServices.listarCitasFinalizadasAlumno({
                idAlumno,
                page,
                pageSize,
                sortBy,
                sortOrder
            });
    
            res.status(200).json({
                message: 'Citas finalizadas listadas con éxito',
                data: resultado
            });
        } catch (err) {
            console.error("Error al listar las citas finalizadas", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async listarCitasCanceladasAlumno(req, res) {
        const idAlumno = req.user.id;
        
        const page = parseInt(req.params.page); 
        const {pageSize = 10, sortBy = 'fechaHoraInicio', sortOrder = 'DESC' } = req.query;
    
        try {
            const resultado = await SesionCitaServices.listarCitasCanceladasAlumno({
                idAlumno,
                page,
                pageSize,
                sortBy,
                sortOrder
            });
    
            res.status(200).json({
                message: 'Citas canceladas listadas con éxito',
                data: resultado
            });
        } catch (err) {
            console.error("Error al listar las citas canceladas", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async obtenerReporteAlumno(req, res) {
        try {
          const { idCoordinador, searchCriteria } = req.body;
          const reporte = await SesionCitaServices.obtenerReporteAlumno(idCoordinador, searchCriteria);
          res.status(200).json(reporte);
        } catch (error) {
        console.error('Error al obtener reporte de alumno:', error.message);
        await logError(error, req.user.id, req.originalUrl, req.method, req.body);
          res.status(500).json({ error});
        }
    },
    async listarCitasXTutorTokenJson(req, res) {
        //valida si el id del tutor lo pasan por el cuerpo del json si lo encuentra
        //trabaja con ese, sino trabaja con el id que esta en el cuerpo del token
        const idTutor = req.body.idTutor ? req.body.idTutor : req.user.id;
        console.log("idTutor: ", idTutor);
        try{
            const listado = await SesionCitaServices.listarCitasXTutorTokenJson(idTutor);
            res.status(201).json({
                message: "Listado de Citas con éxito",
                listado
            });
        }catch(err){
            console.error("Error al listar las Citas del tutor", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
    async obtenerReporteAlumnosParaTutor(req, res) {
        try {
            const { idAlumno, idTipoTutoria, fechaDesde, fechaHasta } = req.body;
            const reporte = await SesionCitaServices.obtenerReporteAlumnosParaTutor(idAlumno, idTipoTutoria, fechaDesde, fechaHasta);
            res.status(200).json(reporte);
        } catch (error) {
            console.error('Error al obtener reporte de alumno:', error.message);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: error.message });
        }
    }
}

module.exports = SesionCitaController;