const TipoFormatoServices = require('../services/TipoFormatoServices');

const TipoFormatoController = {
    async createTipoFormato(req, res) {
        const { nombre, descripcion } = req.body;
        try {
            const nuevoTipoFormato = await TipoFormatoServices.createTipoFormato({ nombre, descripcion });
            res.status(201).json({
                message: 'TipoFormato creado con éxito',
                nuevoTipoFormato
            });
        } catch (err) {
            console.error("Error creando el TipoFormato.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllTipoFormatos(req, res) {
        try {
            const tipoFormatos = await TipoFormatoServices.getAllTipoFormatos();
            res.status(200).json(tipoFormatos);
        } catch (err) {
            console.error("Error obteniendo los TipoFormato.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getTipoFormatoById(req, res) {
        const { id } = req.params;
        try {
            const tipoFormato = await TipoFormatoServices.getTipoFormatoById(id);
            if (!tipoFormato) {
                return res.status(404).json({ error: 'TipoFormato no encontrado' });
            }
            res.status(200).json(tipoFormato);
        } catch (err) {
            console.error("Error obteniendo el TipoFormato.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateTipoFormato(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const tipoFormatoActualizado = await TipoFormatoServices.updateTipoFormato(id, updateData);
            if (!tipoFormatoActualizado) {
                return res.status(404).json({ error: 'TipoFormato no encontrado' });
            }
            res.status(200).json({
                message: "TipoFormato actualizado con éxito",
                tipoFormatoActualizado
            });
        } catch (err) {
            console.error("Error actualizando el TipoFormato.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalTipoFormato(req, res) {
        const { id } = req.params;
        try {
            const result = await TipoFormatoServices.deleteLogicalTipoFormato(id);
            if (!result) {
                return res.status(404).json({ error: 'TipoFormato no encontrado' });
            }
            res.status(200).json({
                message: "TipoFormato eliminado con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando el TipoFormato.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    }
};

module.exports = TipoFormatoController;
