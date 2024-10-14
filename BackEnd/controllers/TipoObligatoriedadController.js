const TipoObligatoriedadServices = require('../services/TipoObligatoriedadServices');

const TipoObligatoriedadController = {
    async createTipoObligatoriedad(req, res) {
        const { nombre, descripcion } = req.body;
        try {
            const nuevoTipoObligatoriedad = await TipoObligatoriedadServices.createTipoObligatoriedad({ nombre, descripcion });
            res.status(201).json({
                message: 'TipoObligatoriedad creado con éxito',
                nuevoTipoObligatoriedad
            });
        } catch (err) {
            console.error("Error creando el TipoObligatoriedad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllTipoObligatoriedades(req, res) {
        try {
            const tipoObligatoriedades = await TipoObligatoriedadServices.getAllTipoObligatoriedades();
            res.status(200).json(tipoObligatoriedades);
        } catch (err) {
            console.error("Error obteniendo los TipoObligatoriedad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getTipoObligatoriedadById(req, res) {
        const { id } = req.params;
        try {
            const tipoObligatoriedad = await TipoObligatoriedadServices.getTipoObligatoriedadById(id);
            if (!tipoObligatoriedad) {
                return res.status(404).json({ error: 'TipoObligatoriedad no encontrado' });
            }
            res.status(200).json(tipoObligatoriedad);
        } catch (err) {
            console.error("Error obteniendo el TipoObligatoriedad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateTipoObligatoriedad(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const tipoObligatoriedadActualizado = await TipoObligatoriedadServices.updateTipoObligatoriedad(id, updateData);
            if (!tipoObligatoriedadActualizado) {
                return res.status(404).json({ error: 'TipoObligatoriedad no encontrado' });
            }
            res.status(200).json({
                message: "TipoObligatoriedad actualizado con éxito",
                tipoObligatoriedadActualizado
            });
        } catch (err) {
            console.error("Error actualizando el TipoObligatoriedad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalTipoObligatoriedad(req, res) {
        const { id } = req.params;
        try {
            const result = await TipoObligatoriedadServices.deleteLogicalTipoObligatoriedad(id);
            if (!result) {
                return res.status(404).json({ error: 'TipoObligatoriedad no encontrado' });
            }
            res.status(200).json({
                message: "TipoObligatoriedad eliminado con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando el TipoObligatoriedad.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    }
};

module.exports = TipoObligatoriedadController;
