const EstadoSolicitudTutorFijoServices = require('../services/EstadoSolicitudTutorFijoServices');

const EstadoSolicitudTutorFijoController = {
    async createEstadoSolicitudTutorFijo(req, res) {
        const { nombre, descripcion } = req.body;
        try {
            const nuevoEstadoSolicitudTutorFijo = await EstadoSolicitudTutorFijoServices.createEstadoSolicitudTutorFijo({ nombre, descripcion });
            res.status(201).json({
                message: 'EstadoSolicitudTutorFijo creado con éxito',
                nuevoEstadoSolicitudTutorFijo
            });
        } catch (err) {
            console.error("Error creando el EstadoSolicitudTutorFijo.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllEstadoSolicitudTutorFijos(req, res) {
        try {
            const estadoSolicitudTutorFijos = await EstadoSolicitudTutorFijoServices.getAllEstadoSolicitudTutorFijos();
            res.status(200).json(estadoSolicitudTutorFijos);
        } catch (err) {
            console.error("Error obteniendo los EstadoSolicitudTutorFijo.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getEstadoSolicitudTutorFijoById(req, res) {
        const { id } = req.params;
        try {
            const estadoSolicitudTutorFijo = await EstadoSolicitudTutorFijoServices.getEstadoSolicitudTutorFijoById(id);
            if (!estadoSolicitudTutorFijo) {
                return res.status(404).json({ error: 'EstadoSolicitudTutorFijo no encontrado' });
            }
            res.status(200).json(estadoSolicitudTutorFijo);
        } catch (err) {
            console.error("Error obteniendo el EstadoSolicitudTutorFijo.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateEstadoSolicitudTutorFijo(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const estadoSolicitudTutorFijoActualizado = await EstadoSolicitudTutorFijoServices.updateEstadoSolicitudTutorFijo(id, updateData);
            if (!estadoSolicitudTutorFijoActualizado) {
                return res.status(404).json({ error: 'EstadoSolicitudTutorFijo no encontrado' });
            }
            res.status(200).json({
                message: "EstadoSolicitudTutorFijo actualizado con éxito",
                estadoSolicitudTutorFijoActualizado
            });
        } catch (err) {
            console.error("Error actualizando el EstadoSolicitudTutorFijo.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalEstadoSolicitudTutorFijo(req, res) {
        const { id } = req.params;
        try {
            const result = await EstadoSolicitudTutorFijoServices.deleteLogicalEstadoSolicitudTutorFijo(id);
            if (!result) {
                return res.status(404).json({ error: 'EstadoSolicitudTutorFijo no encontrado' });
            }
            res.status(200).json({
                message: "EstadoSolicitudTutorFijo eliminado con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando el EstadoSolicitudTutorFijo.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    }
};

module.exports = EstadoSolicitudTutorFijoController;
