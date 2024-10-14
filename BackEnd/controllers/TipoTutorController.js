const TipoTutorServices = require('../services/TipoTutorServices');

const TipoTutorController = {
    async createTipoTutor(req, res) {
        const { nombre, descripcion } = req.body;
        try {
            const nuevoTipoTutor = await TipoTutorServices.createTipoTutor({ nombre, descripcion });
            res.status(201).json({
                message: 'TipoTutor creado con éxito',
                nuevoTipoTutor
            });
        } catch (err) {
            console.error("Error creando el TipoTutor.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getAllTipoTutores(req, res) {
        try {
            const tipoTutores = await TipoTutorServices.getAllTipoTutores();
            res.status(200).json(tipoTutores);
        } catch (err) {
            console.error("Error obteniendo los TipoTutor.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async getTipoTutorById(req, res) {
        const { id } = req.params;
        try {
            const tipoTutor = await TipoTutorServices.getTipoTutorById(id);
            if (!tipoTutor) {
                return res.status(404).json({ error: 'TipoTutor no encontrado' });
            }
            res.status(200).json(tipoTutor);
        } catch (err) {
            console.error("Error obteniendo el TipoTutor.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async updateTipoTutor(req, res) {
        const { id } = req.params;
        const updateData = req.body;
        try {
            const tipoTutorActualizado = await TipoTutorServices.updateTipoTutor(id, updateData);
            if (!tipoTutorActualizado) {
                return res.status(404).json({ error: 'TipoTutor no encontrado' });
            }
            res.status(200).json({
                message: "TipoTutor actualizado con éxito",
                tipoTutorActualizado
            });
        } catch (err) {
            console.error("Error actualizando el TipoTutor.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    },

    async deleteLogicalTipoTutor(req, res) {
        const { id } = req.params;
        try {
            const result = await TipoTutorServices.deleteLogicalTipoTutor(id);
            if (!result) {
                return res.status(404).json({ error: 'TipoTutor no encontrado' });
            }
            res.status(200).json({
                message: "TipoTutor eliminado con éxito",
                result
            });
        } catch (err) {
            console.error("Error eliminando el TipoTutor.", err);
            res.status(500).json({ error: { message: 'Error interno del servidor' } });
        }
    }
};

module.exports = TipoTutorController;
