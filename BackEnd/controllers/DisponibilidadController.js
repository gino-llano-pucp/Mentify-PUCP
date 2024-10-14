const DisponibilidadServices = require('../services/DisponibilidadServices');
const moment = require('moment-timezone');
const logError = require('../utils/loggingErrors');

const DisponibilidadController = {
    async createOrUpdateDisponibilidad(req, res){
        const { disponibilidadesData, deletedDisponibilidades } = req.body;
        console.log("data disponibilidades back: ", disponibilidadesData);
        const fid_tutor = req.body.idTutor ? req.body.idTutor : req.user.id;
        console.log("user", req.user);
        console.log("fid tutor: ", fid_tutor);

        const performedBy = req.user.id;
        try {
            // Eliminar disponibilidades
            if (disponibilidadesData && deletedDisponibilidades.length > 0) {
                await DisponibilidadServices.deleteDisponibilidades(deletedDisponibilidades, performedBy);
            }

            // Crear o actualizar disponibilidades
            const nuevasDisponibilidades = await Promise.all(
                disponibilidadesData.map(disponibilidad => 
                    DisponibilidadServices.createOrUpdateDisponibilidad({
                        id: disponibilidad.id,
                        fid_tutor: fid_tutor, 
                        fechaHoraInicio: disponibilidad.fechaHoraInicio,
                        fechaHoraFin: disponibilidad.fechaHoraFin,
                        performedBy
                    })
                )
            );
            
            console.log("nuevas disp: ", nuevasDisponibilidades);
            
            // Convertir las fechas de UTC a GMT-5
            const disponibilidadesConvertidas = nuevasDisponibilidades.map(disponibilidad => ({
                id: disponibilidad.id_disponibilidad,
                title: 'Disponible',
                start: moment(disponibilidad.fechaHoraInicio).tz('America/Lima').format(),
                end: moment(disponibilidad.fechaHoraFin).tz('America/Lima').format(),
                color: 'rgba(0, 193, 188, 100%)',
                display: 'background',
                allDay: false
            }));

            console.log("disponibilidades enviar: ", disponibilidadesConvertidas);

            res.status(201).json({
                message: 'Disponibilidades creadas con éxito',
                disponibilidades: disponibilidadesConvertidas
            });
        } catch(error) {
            console.error("Error guardando las disponbilidades.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAll(req, res){
        try {
            const disponibilidadList = await DisponibilidadServices.getAll();
            res.status(200).json({
                message: "Data retrieved successfully",
                disponibilidadList
            });
        } catch(error) {
            console.error("Error retrieving Disponibilidad data", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    // Controlador para obtener disponibilidades del tutor autenticado
    async getDisponibilidades(req, res) {
        const fid_tutor = req.user.id;
        try {
            const disponibilidades = await DisponibilidadServices.getDisponibilidadesByTutor(fid_tutor);

            // Convertir las fechas de UTC a GMT-5
            const disponibilidadesConvertidas = disponibilidades.map(disponibilidad => ({
                id_disponibilidad: disponibilidad.id_disponibilidad,
                fechaHoraInicio: moment(disponibilidad.fechaHoraInicio).tz('America/Lima').format(),
                fechaHoraFin: moment(disponibilidad.fechaHoraFin).tz('America/Lima').format()
            }));

            res.status(200).json(disponibilidadesConvertidas);
        } catch (error) {
            console.error("Error obteniendo las disponibilidades.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    // Controlador para obtener disponibilidades de un tutor específico (pasando su ID)
    async obtenerDisponibilidadTutor(req, res) {
        const { idTutor } = req.body;
        if (!idTutor) {
            return res.status(400).json({ error: { message: 'Falta el parámetro idTutor' } });
        }

        try {
            const disponbilidades = await DisponibilidadServices.getDisponibilidadesByTutor(idTutor);
            // Convertir las fechas de UTC a GMT-5
            const disponibilidadesConvertidas = disponbilidades.map(disponibilidad => ({
                id_disponibilidad: disponibilidad.id_disponibilidad,
                fechaHoraInicio: moment(disponibilidad.fechaHoraInicio).tz('America/Lima').format(),
                fechaHoraFin: moment(disponibilidad.fechaHoraFin).tz('America/Lima').format()
            }));
            res.status(200).json(disponibilidadesConvertidas);
        } catch (error) {
            console.error("Error obteniendo las disponibilidades.", error);
            await logError(error, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getById(req, res){
        const { id } = req.body;
        try {
            const disponibilidad = await DisponibilidadServices.getById(id);
            if(!disponibilidad){
                return res.status(404).json({ error: 'Disponibilidad not found' });
            }
            res.status(200).json({
                message: "Disponibilidad retrieved successfully",
                disponibilidad
            });
        } catch(err) {
            console.error('Error retrieving Disponibilidad:', err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async update(req, res){
        const { id, ...updateData } = req.body;
        const performedBy = req.user.id;
        try {
            const updatedDisponibilidad = await DisponibilidadServices.update(id, updateData, performedBy);
            if(!updatedDisponibilidad){
                return res.status(404).json({ error: 'Disponibilidad not found' });
            }
            res.status(200).json({
                message: "Disponibilidad updated successfully",
                updatedDisponibilidad
            });
        } catch(err) {
            console.error('Error updating Disponibilidad:', err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },

    async deleteLogical(req, res){
        const { id } = req.body;
        const performedBy = req.user.id;
        try {
            const result = await DisponibilidadServices.deleteLogical(id, performedBy);
            if(!result){
                return res.status(404).json({ error: 'Disponibilidad not found' });
            }
            res.status(200).json({
                message: "Disponibilidad deleted successfully",
                result
            });
        } catch(err) {
            console.error('Error deleting Disponibilidad:', err);
            await logError(err, req.user.id, req.originalUrl, req.method, req.body);
            res.status(500).json({ error: 'Internal server error' });
        }
    },
};

module.exports = DisponibilidadController;
