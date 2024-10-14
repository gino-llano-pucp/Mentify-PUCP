const db = require('../models');
const TipoPermanencia = db.TipoPermanencia;

const TipoPermanenciaServices = {
    async createTipoPermanencia({ nombre, descripcion }) {
        return await TipoPermanencia.create({ nombre, descripcion, esActivo: true });
    },

    async getAllTipoPermanencias() {
        return await TipoPermanencia.findAll();
    },

    async getTipoPermanenciaById(id) {
        return await TipoPermanencia.findByPk(id);
    },

    async updateTipoPermanencia(id, updateData) {
        const tipoPermanencia = await TipoPermanencia.findByPk(id);
        if (!tipoPermanencia) {
            return null;
        }
        await tipoPermanencia.update(updateData);
        return tipoPermanencia;
    },

    async deleteLogicalTipoPermanencia(id) {
        const tipoPermanencia = await TipoPermanencia.findByPk(id);
        if (!tipoPermanencia) {
            return null;
        }
        await tipoPermanencia.update({ esActivo: false });
        return tipoPermanencia;
    }
};

module.exports = TipoPermanenciaServices;
