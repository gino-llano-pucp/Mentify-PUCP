const db = require('../models');
const TipoModalidad = db.TipoModalidad;

const TipoModalidadServices = {
    async createTipoModalidad({ nombre, descripcion }) {
        return await TipoModalidad.create({ nombre, descripcion, esActivo: true });
    },

    async getAllTipoModalidad() {
        return await TipoModalidad.findAll();
    },

    async getTipoModalidadById(id) {
        return await TipoModalidad.findByPk(id);
    },

    async updateTipoModalidad(id, updateData) {
        const tipoModalidad = await TipoModalidad.findByPk(id);
        if (!tipoModalidad) {
            return null;
        }
        await tipoModalidad.update(updateData);
        return tipoModalidad;
    },

    async deleteLogicalTipoModalidad(id) {
        const tipoModalidad = await TipoModalidad.findByPk(id);
        if (!tipoModalidad) {
            return null;
        }
        await tipoModalidad.update({ esActivo: false });
        return tipoModalidad;
    }
};

module.exports = TipoModalidadServices;


