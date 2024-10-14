const TipoModalidadServices = require('../services/TipoModalidadServices');

const TipoModalidadController = {
    async createTipoModalidad(req, res) {
        const { nombre, descripcion } = req.body;
        try {
            const nuevaTipoModalidad = await TipoModalidadServices.createTipoModalidad({ nombre, descripcion });
            res.status(201).json({
                message: 'TipoModalidad creado con éxito',
                nuevaTipoModalidad
            });
        } catch (err) {
            console.error("Error creando el TipoModalidad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllTipoModalidades(req, res) {
        try {
            const tipoModalidades = await TipoModalidadServices.getAllTipoModalidades();
            res.status(200).json(tipoModalidades);
        } catch (err) {
            console.error("Error obteniendo los TipoModalidad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getTipoModalidadById(req, res) {
        const { id } = req.params;
        try {
            const tipoModalidad = await TipoModalidadServices.getTipoModalidadById(id);
            if (!tipoModalidad) {
                return res.status(404).json({ error: 'TipoModalidad no encontrado' });
            }
            res.status(200).json(tipoModalidad);
        } catch (err) {
            console.error("Error obteniendo el TipoModalidad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateTipoModalidad(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const tipoModalidadActualizado = await TipoModalidadServices.updateTipoModalidad(id, updateData);
            if (!tipoModalidadActualizado) {
                return res.status(404).json({ error: 'TipoModalidad no encontrado' });
            }
            res.status(200).json({
                message: "TipoModalidad actualizado con éxito",
                tipoModalidadActualizado
            });
        } catch (err) {
            console.error("Error actualizando el TipoModalidad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalTipoModalidad(req, res) {
        const { id } = req.params;
        try {
            const result = await TipoModalidadServices.deleteLogicalTipoModalidad(id);
            if (!result) {
                return res.status(404).json({ error: 'TipoModalidad no encontrado' });
            }
            res.status(200).json({
                message: "TipoModalidad eliminado con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando el TipoModalidad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    }
};

module.exports = TipoModalidadController;
