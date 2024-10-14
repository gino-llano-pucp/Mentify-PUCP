const db = require('../models');
const TipoObligatoriedad = db.TipoObligatoriedad;

const TipoObligatoriedadServices = {
    async createTipoObligatoriedad({ nombre, descripcion }) {
        return await TipoObligatoriedad.create({ nombre, descripcion, esActivo: true });
    },

    async getAllTipoObligatoriedades() {
        return await TipoObligatoriedad.findAll();
    },

    async getTipoObligatoriedadById(id) {
        return await TipoObligatoriedad.findByPk(id);
    },

    async updateTipoObligatoriedad(id, updateData) {
        const tipoObligatoriedad = await TipoObligatoriedad.findByPk(id);
        if (!tipoObligatoriedad) {
            return null;
        }
        await tipoObligatoriedad.update(updateData);
        return tipoObligatoriedad;
    },

    async deleteLogicalTipoObligatoriedad(id) {
        const tipoObligatoriedad = await TipoObligatoriedad.findByPk(id);
        if (!tipoObligatoriedad) {
            return null;
        }
        await tipoObligatoriedad.update({ esActivo: false });
        return tipoObligatoriedad;
    }
};

module.exports = TipoObligatoriedadServices;


