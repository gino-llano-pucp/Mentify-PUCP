const TipoPermanenciaServices = require('../services/TipoPermanenciaServices');

const TipoPermanenciaController = {
    async createTipoPermanencia(req, res) {
        const { nombre, descripcion } = req.body;
        try {
            const nuevoTipoPermanencia = await TipoPermanenciaServices.createTipoPermanencia({ nombre, descripcion });
            res.status(201).json({
                message: 'TipoPermanencia creado con éxito',
                nuevoTipoPermanencia
            });
        } catch (err) {
            console.error("Error creando el TipoPermanencia.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllTipoPermanencias(req, res) {
        try {
            const tipoPermanencias = await TipoPermanenciaServices.getAllTipoPermanencias();
            res.status(200).json(tipoPermanencias);
        } catch (err) {
            console.error("Error obteniendo los TipoPermanencia.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getTipoPermanenciaById(req, res) {
        const { id } = req.params;
        try {
            const tipoPermanencia = await TipoPermanenciaServices.getTipoPermanenciaById(id);
            if (!tipoPermanencia) {
                return res.status(404).json({ error: 'TipoPermanencia no encontrado' });
            }
            res.status(200).json(tipoPermanencia);
        } catch (err) {
            console.error("Error obteniendo el TipoPermanencia.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateTipoPermanencia(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const tipoPermanenciaActualizado = await TipoPermanenciaServices.updateTipoPermanencia(id, updateData);
            if (!tipoPermanenciaActualizado) {
                return res.status(404).json({ error: 'TipoPermanencia no encontrado' });
            }
            res.status(200).json({
                message: "TipoPermanencia actualizado con éxito",
                tipoPermanenciaActualizado
            });
        } catch (err) {
            console.error("Error actualizando el TipoPermanencia.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalTipoPermanencia(req, res) {
        const { id } = req.params;
        try {
            const result = await TipoPermanenciaServices.deleteLogicalTipoPermanencia(id);
            if (!result) {
                return res.status(404).json({ error: 'TipoPermanencia no encontrado' });
            }
            res.status(200).json({
                message: "TipoPermanencia eliminado con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando el TipoPermanencia.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    }
};

module.exports = TipoPermanenciaController;
