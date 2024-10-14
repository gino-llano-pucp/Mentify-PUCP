const SolicitudTutorFijoServices = require('../services/SolicitudTutorFijoServices');
const logError = require('../utils/loggingErrors'); 

const SolicitudTutorFijoController = {
    async createSolicitudTutorFijo(req, res) {
        const { fid_alumno, fid_tutor, fid_tipoTutoria, es_rechazado, motivo_rechazo, fid_estadoSolicitud, fecha_cierre } = req.body;
        const performedBy = req.user.id;
        try {
            const nuevaSolicitudTutorFijo = await SolicitudTutorFijoServices.createSolicitudTutorFijo({ fid_alumno, fid_tutor,
                 fid_tipoTutoria, es_rechazado, motivo_rechazo, fid_estadoSolicitud, fecha_cierre, performedBy });
            res.status(201).json({
                message: 'SolicitudTutorFijo creada con éxito',
                nuevaSolicitudTutorFijo
            });
        } catch (err) {
            console.error("Error creando la SolicitudTutorFijo.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },
    async respondToSolicitudTutorFijo(req, res) {
        const { solicitudId, tipoTutoriaId, tutorId, aceptada, motivoRechazo } = req.body;
        const performedBy = req.user.id;
        try {
            const respuesta = await SolicitudTutorFijoServices.respondToSolicitudTutorFijo(solicitudId, tipoTutoriaId, 
                tutorId, aceptada, motivoRechazo, performedBy);
            res.status(201).json({
                message: 'Respuesta a SolicitudTutorFijo registrada con éxito',
                respuesta
            });
        } catch (err) {
            console.error("Error al responder la SolicitudTutorFijo.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllSolicitudTutorFijos(req, res) {
        try {
            const solicitudTutorFijos = await SolicitudTutorFijoServices.getAllSolicitudTutorFijos();
            res.status(200).json(solicitudTutorFijos);
        } catch (err) {
            console.error("Error obteniendo las SolicitudTutorFijo.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getSolicitudTutorFijoById(req, res) {
        const { id } = req.params;
        try {
            const solicitudTutorFijo = await SolicitudTutorFijoServices.getSolicitudTutorFijoById(id);
            if (!solicitudTutorFijo) {
                return res.status(404).json({ error: 'SolicitudTutorFijo no encontrada' });
            }
            res.status(200).json(solicitudTutorFijo);
        } catch (err) {
            console.error("Error obteniendo la SolicitudTutorFijo.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateSolicitudTutorFijo(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const solicitudTutorFijoActualizada = await SolicitudTutorFijoServices.updateSolicitudTutorFijo(id, updateData);
            if (!solicitudTutorFijoActualizada) {
                return res.status(404).json({ error: 'SolicitudTutorFijo no encontrada' });
            }
            res.status(200).json({
                message: "SolicitudTutorFijo actualizada con éxito",
                solicitudTutorFijoActualizada
            });
        } catch (err) {
            console.error("Error actualizando la SolicitudTutorFijo.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalSolicitudTutorFijo(req, res) {
        const { id } = req.params;
        try {
            const result = await SolicitudTutorFijoServices.deleteLogicalSolicitudTutorFijo(id);
            if (!result) {
                return res.status(404).json({ error: 'SolicitudTutorFijo no encontrada' });
            }
            res.status(200).json({
                message: "SolicitudTutorFijo eliminada con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando la SolicitudTutorFijo.", err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getSolicitudesPaginadoPorCoordinador(req, res) {
        const { page = 1 } = req.params;
        const { inputSearch, tipoTutoria, estadoSolicitud, fechaDesde, fechaHasta, pageSize, sortBy, sortOrder } = req.body;

        console.log(req.body)

        try {
            const result = await SolicitudTutorFijoServices.getSolicitudesPaginadoPorCoordinador(inputSearch, tipoTutoria, estadoSolicitud, fechaDesde, fechaHasta, page, pageSize, sortBy, sortOrder);
            if (!result) {
              return res
                .status(404)
                .json({ error: "ENVIA PS" });
            }
            res.status(200).json({
                message: "Solicitudes listadas con éxito",
                data: result
            });
        } catch (error) {
            console.error('Error al listar solicitudes:', error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    }
};

module.exports = SolicitudTutorFijoController;
