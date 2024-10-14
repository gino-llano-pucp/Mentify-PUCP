const db = require('../models');
const TipoFormato = db.TipoFormato;

const TipoFormatoServices = {
    async createTipoFormato({ nombre, descripcion }) {
        return await TipoFormato.create({ nombre, descripcion, esActivo: true });
    },

    async getAllTipoFormatos() {
        return await TipoFormato.findAll();
    },

    async getTipoFormatoById(id) {
        return await TipoFormato.findByPk(id);
    },

    async updateTipoFormato(id, updateData) {
        const tipoFormato = await TipoFormato.findByPk(id);
        if (!tipoFormato) {
            return null;
        }
        await tipoFormato.update(updateData);
        return tipoFormato;
    },

    async deleteLogicalTipoFormato(id) {
        const tipoFormato = await TipoFormato.findByPk(id);
        if (!tipoFormato) {
            return null;
        }
        await tipoFormato.update({ esActivo: false });
        return tipoFormato;
    }
};

module.exports = TipoFormatoServices;
