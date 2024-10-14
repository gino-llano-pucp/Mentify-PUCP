const db = require('../models');
const TipoTutor = db.TipoTutor;

const TipoTutorServices = {
    async createTipoTutor({ nombre, descripcion }) {
        return await TipoTutor.create({ nombre, descripcion, esActivo: true });
    },

    async getAllTipoTutores() {
        return await TipoTutor.findAll();
    },

    async getTipoTutorById(id) {
        return await TipoTutor.findByPk(id);
    },

    async updateTipoTutor(id, updateData) {
        const tipoTutor = await TipoTutor.findByPk(id);
        if (!tipoTutor) {
            return null;
        }
        await tipoTutor.update(updateData);
        return tipoTutor;
    },

    async deleteLogicalTipoTutor(id) {
        const tipoTutor = await TipoTutor.findByPk(id);
        if (!tipoTutor) {
            return null;
        }
        await tipoTutor.update({ esActivo: false });
        return tipoTutor;
    }
};

module.exports = TipoTutorServices;
